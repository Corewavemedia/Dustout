import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { sendBookingConfirmationEmail, sendAdminNotificationEmail, sendSubscriptionConfirmationEmail, sendSubscriptionCancellationEmail, sendSubscriptionAdminNotificationEmail, sendSubscriptionUpgradeEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const prisma = new PrismaClient();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Type definitions for booking data
interface BookingVariable {
  variableId: string;
  quantity: number;
}

interface BookingSelectedService {
  serviceId: string;
  serviceName?: string;
  variables: BookingVariable[];
}



export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', errorMessage);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      
      if (session.mode === 'subscription') {
        // Handle subscription creation
        await handleSubscriptionCreated(session);
      } else if (session.metadata?.isUpgrade === 'true') {
        // Handle subscription upgrade payment
        await handleUpgradePayment(session);
      } else {
        // Handle booking payment
        await handleBookingPayment(session);
      }
      break;

    case 'customer.subscription.created':
      const createdSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionActivated(createdSubscription);
      break;

    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(updatedSubscription);
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCancelled(deletedSubscription);
      break;

    case 'invoice.payment_succeeded':
      const succeededInvoice = event.data.object as Stripe.Invoice;
      if ('subscription' in succeededInvoice) {
        await handlePaymentSucceeded(succeededInvoice);
      }
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      if ('subscription' in failedInvoice) {
        await handlePaymentFailed(failedInvoice);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleBookingPayment(session: Stripe.Checkout.Session) {
  try {
    // Extract booking data from client_reference_id and metadata
    const userId = session.metadata?.userId;
    const clientReferenceId = session.client_reference_id;
    
    if (!userId || !clientReferenceId) {
      console.error('Missing userId or client_reference_id in session');
      return;
    }

        // Extract booking reference ID from client_reference_id
        const bookingReferenceId = session.client_reference_id!;
        
        // Retrieve booking data from temporary storage
        const tempBookingData = await prisma.tempBookingData.findUnique({
          where: { referenceId: bookingReferenceId }
        });
        
        if (!tempBookingData) {
          console.error('Booking data not found for reference ID:', bookingReferenceId);
          return NextResponse.json({ error: 'Booking data not found' }, { status: 400 });
        }
        
        const bookingData = JSON.parse(tempBookingData.bookingData);

        console.log('Creating booking for user:', userId);
        console.log('Booking data:', JSON.stringify(bookingData, null, 2));
        
        // Create booking in database
        let booking;
        try {
          booking = await prisma.$transaction(async (tx) => {
          console.log('Starting transaction for booking creation');
          // Create the main booking
          const newBooking = await tx.booking.create({
            data: {
              userId: userId,
              fullName: bookingData.fullName,
              email: bookingData.email,
              phone: bookingData.phone,
              address: bookingData.address,
              city: bookingData.city,
              postcode: bookingData.postcode,
              frequency: bookingData.frequency,
              preferredDate: new Date(bookingData.preferredDate),
              preferredTime: bookingData.preferredTime,
              estimatedPrice: bookingData.estimatedPrice,
              specialInstructions: bookingData.specialInstructions || '',
              status: 'confirmed',
              paymentStatus: 'paid',
              stripeSessionId: session.id,
              paymentIntentId: session.payment_intent as string,
            },
          });

          console.log('Booking created with ID:', newBooking.id);
          
          // Create booking services
          console.log('Creating booking services for', bookingData.selectedServices?.length || 0, 'services');
          for (const selectedService of bookingData.selectedServices || []) {
            console.log('Processing service:', selectedService.serviceId);
            for (const variable of selectedService.variables || []) {
              console.log('Processing variable:', variable.variableId, 'with quantity:', variable.quantity);
              
              // Get the service and variable data
              const service = await tx.service.findUnique({
                where: { id: selectedService.serviceId },
              });
              
              const serviceVariable = await tx.serviceVariable.findUnique({
                where: { id: variable.variableId },
              });

              if (service && serviceVariable) {
                console.log('Creating booking service for:', service.name, 'variable:', serviceVariable.name);
                await tx.bookingService.create({
                  data: {
                    bookingId: newBooking.id,
                    serviceId: selectedService.serviceId,
                    serviceName: service.name,
                    variableId: variable.variableId,
                    variableName: serviceVariable.name,
                    variableValue: `${variable.quantity} x ${serviceVariable.name}`,
                    price: serviceVariable.unitPrice * variable.quantity,
                  },
                });
              } else {
                console.error('Service or variable not found:', selectedService.serviceId, variable.variableId);
              }
            }
          }
          
          console.log('Transaction completed successfully');
           return newBooking;
         });
        } catch (transactionError) {
          console.error('Transaction failed:', transactionError);
          throw transactionError;
        }

        // Transform services data for email functions
        const transformedServices = await Promise.all(
          (bookingData.selectedServices || []).map(async (selectedService: BookingSelectedService) => {
            // Get the service details
            const service = await prisma.service.findUnique({
              where: { id: selectedService.serviceId },
            });
            
            const selectedVariables = await Promise.all(
              (selectedService.variables || []).map(async (variable: BookingVariable) => {
                // Get the service variable details
                const serviceVariable = await prisma.serviceVariable.findUnique({
                  where: { id: variable.variableId },
                });
                
                return {
                  variableName: serviceVariable?.name || 'Unknown Variable',
                  variableValue: `${variable.quantity} x ${serviceVariable?.name || 'Unknown'}`,
                };
              })
            );
            
            return {
              serviceName: service?.name || 'Unknown Service',
              selectedVariables,
            };
          })
        );

        // Send confirmation emails
        try {
          await sendBookingConfirmationEmail({
            to: bookingData.email,
            customerName: bookingData.fullName,
            bookingId: booking.id,
            services: transformedServices,
            preferredDate: bookingData.preferredDate,
            preferredTime: bookingData.preferredTime,
            totalAmount: bookingData.estimatedPrice,
            address: `${bookingData.address}, ${bookingData.city}, ${bookingData.postcode}`,
          });

          await sendAdminNotificationEmail({
            customerName: bookingData.fullName,
            customerEmail: bookingData.email,
            customerPhone: bookingData.phone,
            bookingId: booking.id,
            services: transformedServices,
            preferredDate: bookingData.preferredDate,
            preferredTime: bookingData.preferredTime,
            totalAmount: bookingData.estimatedPrice,
            address: `${bookingData.address}, ${bookingData.city}, ${bookingData.postcode}`,
            specialInstructions: bookingData.specialInstructions,
          });
          
          // Clean up temporary booking data
          await prisma.tempBookingData.delete({
            where: { referenceId: bookingReferenceId }
          });
        } catch (emailError) {
          console.error('Error sending emails:', emailError);
          // Don't fail the webhook if email fails
        }

        console.log('Booking created successfully:', booking.id);
  } catch (error) {
    console.error('Error processing booking payment:', error);
  }
}

async function handleSubscriptionCreated(session: Stripe.Checkout.Session) {
  try {
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;
    const planName = session.metadata?.planName;
    const planType = session.metadata?.planType;
    const userEmail = session.metadata?.userEmail;

    if (!userId || !planId || !planName || !planType || !userEmail) {
      console.error('Missing metadata in checkout session');
      return;
    }

    // Get the subscription from Stripe
    const stripeSubscription: Stripe.Subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    
    // Find the subscription plan
    const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId }
    });

    if (!subscriptionPlan) {
      console.error('Subscription plan not found:', planId);
      return;
    }

    // Calculate correct dates
    const startDate = new Date(stripeSubscription.start_date * 1000);
    const currentPeriodEnd = new Date(stripeSubscription.items.data[0].current_period_end * 1000);
    const expiryDate = stripeSubscription.ended_at ? new Date(stripeSubscription.ended_at * 1000) : currentPeriodEnd;

    // Create subscription in database
    const subscription = await prisma.subscription.create({
      data: {
        userId: userId,
        planId: planId,
        planName: `${planName} (${planType})`,
        startDate: startDate,
        expiryDate: expiryDate,
        status: 'active',
        revenue: subscriptionPlan.price,
        email: userEmail,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: stripeSubscription.customer as string,
        planType: planType as 'residential' | 'industrial',
        currentPeriodStart: new Date(stripeSubscription.items.data[0].current_period_start * 1000),
        currentPeriodEnd: currentPeriodEnd,
        cancelAtPeriodEnd: false
      }
    });

    console.log('Subscription created in database:', subscription.id);

    // Send confirmation email to customer
    await sendSubscriptionConfirmationEmail({
      to: userEmail,
      customerName: session.customer_details?.name || 'Valued Customer',
      subscriptionId: subscription.id,
      planName: planName,
      planType: planType as 'residential' | 'industrial',
      price: subscriptionPlan.price,
      billingCycle: 'monthly', // Default billing cycle
      startDate: subscription.startDate.toISOString(),
      nextBillingDate: subscription.expiryDate.toISOString(),
      features: subscriptionPlan.features
    });

    // Send admin notification
    await sendSubscriptionAdminNotificationEmail({
      customerName: session.customer_details?.name || 'Unknown',
      customerEmail: userEmail,
      subscriptionId: subscription.id,
      planName: planName,
      price: subscriptionPlan.price,
      action: 'created',
      actionDate: subscription.startDate.toISOString()
    });

  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleUpgradePayment(session: Stripe.Checkout.Session) {
  try {
    const userId = session.metadata?.userId;
    const currentSubscriptionId = session.metadata?.currentSubscriptionId;
    const newPlanId = session.metadata?.newPlanId;
    const newPlanName = session.metadata?.newPlanName;
    const newPlanType = session.metadata?.newPlanType;
    const newPrice = session.metadata?.newPrice;
    const userEmail = session.metadata?.userEmail;

    if (!userId || !currentSubscriptionId || !newPlanId || !newPlanName || !newPlanType || !newPrice || !userEmail) {
      console.error('Missing metadata in upgrade payment session');
      return;
    }

    // Find the current subscription
    const currentSubscription = await prisma.subscription.findUnique({
      where: { id: currentSubscriptionId }
    });

    if (!currentSubscription || !currentSubscription.stripeSubscriptionId) {
      console.error('Current subscription not found or missing Stripe ID');
      return;
    }

    // Find the new subscription plan
    const newSubscriptionPlan = await prisma.subscriptionPlan.findUnique({
      where: { id: newPlanId }
    });

    if (!newSubscriptionPlan) {
      console.error('New subscription plan not found:', newPlanId);
      return;
    }

    // Get the current Stripe subscription
    const stripeSubscription: Stripe.Subscription = await stripe.subscriptions.retrieve(
      currentSubscription.stripeSubscriptionId
    );

    // Create or get Stripe product for the new plan
    const products = await stripe.products.list({
      active: true,
      limit: 100
    });

    let product = products.data.find(p => p.metadata.planId === newPlanId);
    
    if (!product) {
      product = await stripe.products.create({
        name: `${newPlanName} - ${newPlanType.charAt(0).toUpperCase() + newPlanType.slice(1)}`,
        description: `DustOut ${newPlanType} subscription plan`,
        metadata: {
          planId: newPlanId,
          planType: newPlanType
        }
      });
    }

    // Create new Stripe price for the subscription
    const newStripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(parseFloat(newPrice) * 100), // Convert to cents
      currency: 'gbp',
      recurring: {
        interval: 'month'
      },
      metadata: {
        planId: newPlanId,
        planType: newPlanType
      }
    });

    // Update the subscription in Stripe
    const updatedStripeSubscription = await stripe.subscriptions.update(
      currentSubscription.stripeSubscriptionId,
      {
        items: [{
          id: stripeSubscription.items.data[0].id,
          price: newStripePrice.id,
        }],
        proration_behavior: 'none', // No proration since we already charged for the upgrade
        metadata: {
          planId: newPlanId,
          planName: newPlanName,
          planType: newPlanType,
          upgradedAt: new Date().toISOString()
        }
      }
    );

    // Update subscription in database
    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: currentSubscription.id
      },
      data: {
        planId: newPlanId,
        planName: `${newPlanName} (${newPlanType})`,
        revenue: parseFloat(newPrice),
        expiryDate: new Date(updatedStripeSubscription.items.data[0].current_period_end * 1000),
        currentPeriodEnd: new Date(
          updatedStripeSubscription.items.data[0].current_period_end * 1000,)
      }
    });

    console.log('Subscription upgraded successfully:', updatedSubscription.id);

    // Send upgrade confirmation email
    await sendSubscriptionUpgradeEmail({
      to: userEmail,
      customerName: session.customer_details?.name || 'Valued Customer',
      subscriptionId: updatedSubscription.id,
      oldPlanName: currentSubscription.planName,
      newPlanName: `${newPlanName} (${newPlanType})`,
      newPrice: parseFloat(newPrice),
      isUpgrade: true,
      effectiveDate: new Date().toISOString(),
      nextBillingDate: updatedSubscription.expiryDate.toISOString(),
      features: newSubscriptionPlan.features
    });

  } catch (error) {
    console.error('Error processing upgrade payment:', error);
  }
}

async function handleSubscriptionActivated(subscription: Stripe.Subscription) {
  try {
    // Calculate correct dates
    const currentPeriodEnd = new Date(subscription.items.data[0].current_period_end * 1000);
    const expiryDate = subscription.ended_at ? new Date(subscription.ended_at * 1000) : currentPeriodEnd;

    await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: subscription.id
      },
      data: {
        status: 'active',
        startDate: new Date(subscription.start_date * 1000),
        expiryDate: expiryDate,
        currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
        currentPeriodEnd: currentPeriodEnd
      }
    });

    console.log('Subscription activated:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription activated:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    // Calculate correct dates
    const currentPeriodEnd = new Date(subscription.items.data[0].current_period_end * 1000);
    const expiryDate = subscription.ended_at ? new Date(subscription.ended_at * 1000) : currentPeriodEnd;
    
    const updateData: {
      status: 'active' | 'inactive' | 'cancelling' | 'cancelled';
      expiryDate: Date;
      currentPeriodStart: Date;
      currentPeriodEnd: Date;
    } = {
      status: subscription.status === 'active' ? (subscription.cancel_at_period_end ? 'cancelling' : 'active') : 'inactive',
      expiryDate: expiryDate,
      currentPeriodStart: new Date(subscription.items.data[0].current_period_start * 1000),
      currentPeriodEnd: currentPeriodEnd
    };

    if (subscription.status === 'canceled') {
      updateData.status = 'cancelled';
      Object.assign(updateData, { cancelledAt: new Date() });
      Object.assign(updateData, { cancelAtPeriodEnd: subscription.cancel_at_period_end });
    } else if (subscription.cancel_at_period_end) {
      updateData.status = 'cancelling';
      Object.assign(updateData, { cancelAtPeriodEnd: true });
    }

    const dbSubscription = await prisma.subscription.findFirst({
      where: {
        stripeSubscriptionId: subscription.id
      },
      include: {
        user: true,
        plan: true
      }
    });

    await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: subscription.id
      },
      data: updateData
    });

    // Send admin notification for subscription update
    if (dbSubscription) {
      await sendSubscriptionAdminNotificationEmail({
        customerName: dbSubscription.user.fullname || dbSubscription.email || 'Unknown',
        customerEmail: dbSubscription.email || "Unknown",
        subscriptionId: dbSubscription.id,
        planName: dbSubscription.planName,
        price: dbSubscription.plan?.price || 0,
        action: 'updated',
        actionDate: new Date().toISOString()
      });
    }

    console.log('Subscription updated:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  try {
    const dbSubscription = await prisma.subscription.findFirst({
      where: {
        stripeSubscriptionId: subscription.id
      },
      include: {
        user: true,
        plan: true
      }
    });

    if (dbSubscription) {
      await prisma.subscription.update({
        where: {
          id: dbSubscription.id
        },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancelAtPeriodEnd: true
        }
      });

      // Send cancellation email to customer
      await sendSubscriptionCancellationEmail({
        to: dbSubscription.email || "unknown",
        customerName: dbSubscription.user.fullname || dbSubscription.email || 'Customer',
        subscriptionId: dbSubscription.id,
        planName: dbSubscription.planName,
        cancellationDate: new Date().toISOString(),
        endDate: subscription.ended_at ? new Date(subscription.ended_at * 1000).toISOString() : new Date(subscription.start_date * 1000).toISOString()
      });

      // Send admin notification for cancellation
      await sendSubscriptionAdminNotificationEmail({
        customerName: dbSubscription.user.fullname || dbSubscription.email || 'Unknown',
        customerEmail: dbSubscription.email || "",
        subscriptionId: dbSubscription.id,
        planName: dbSubscription.planName,
        price: dbSubscription.plan?.price || 0,
        action: 'cancelled',
        actionDate: new Date().toISOString()
      });
    }

    console.log('Subscription cancelled:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    // Ensure subscription ID is retrieved correctly
    const subscriptionId = invoice.metadata?.subscription_id;
    if (!subscriptionId) {
      console.error('Subscription ID not found in invoice.');
      return;
    }

    // Update subscription with successful payment
    await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: subscriptionId
      },
      data: {
        status: 'active',
        expiryDate: new Date((invoice.period_end || 0) * 1000),
        currentPeriodEnd: new Date((invoice.period_end || 0) * 1000)
      }
    });

    console.log('Payment succeeded for subscription:', subscriptionId);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    // Ensure subscription ID is retrieved correctly
    const subscriptionId = invoice.metadata?.subscription_id;
    if (!subscriptionId) {
      console.error('Subscription ID not found in invoice.');
      return;
    }

    // Mark subscription as past due
    await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: subscriptionId
      },
      data: {
        status: 'past_due'
      }
    });

    console.log('Payment failed for subscription:', subscriptionId);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}