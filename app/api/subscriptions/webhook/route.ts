import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { sendSubscriptionConfirmationEmail, sendSubscriptionCancellationEmail, sendAdminSubscriptionNotificationEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Received Stripe webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription') {
          await handleSubscriptionCreated(session);
        }
        break;
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionActivated(subscription);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancelled(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await handlePaymentSucceeded(invoice);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await handlePaymentFailed(invoice);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
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
    const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription as string);
    
    // Find the subscription plan
    const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId }
    });

    if (!subscriptionPlan) {
      console.error('Subscription plan not found:', planId);
      return;
    }

    // Create subscription in database
    const subscription = await prisma.subscription.create({
      data: {
        userId: userId,
        planId: planId,
        planName: `${planName} (${planType})`,
        startDate: new Date(stripeSubscription.current_period_start * 1000),
        expiryDate: new Date(stripeSubscription.current_period_end * 1000),
        status: 'active',
        revenue: subscriptionPlan.price,
        email: userEmail,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: stripeSubscription.customer as string,
        planType: planType as 'residential' | 'industrial',
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
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
    await sendAdminSubscriptionNotificationEmail({
      customerName: session.customer_details?.name || 'Unknown',
      customerEmail: userEmail,
      subscriptionId: subscription.id,
      planName: planName,
      planType: planType as 'residential' | 'industrial',
      price: subscriptionPlan.price,
      startDate: subscription.startDate.toISOString()
    });

  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionActivated(subscription: Stripe.Subscription) {
  try {
    await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: subscription.id
      },
      data: {
        status: 'active',
        startDate: new Date(subscription.current_period_start * 1000),
        expiryDate: new Date(subscription.current_period_end * 1000),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000)
      }
    });

    console.log('Subscription activated:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription activated:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const updateData: any = {
      status: subscription.status === 'active' ? 'active' : 'inactive',
      expiryDate: new Date(subscription.current_period_end * 1000),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    };

    if (subscription.status === 'canceled') {
      updateData.status = 'cancelled';
      updateData.cancelledAt = new Date();
      updateData.cancelAtPeriodEnd = true;
    }

    await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: subscription.id
      },
      data: updateData
    });

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
        user: true
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

      // Send cancellation email
      await sendSubscriptionCancellationEmail({
        to: dbSubscription.email,
        customerName: dbSubscription.user.fullname || dbSubscription.email || 'Customer',
        subscriptionId: dbSubscription.id,
        planName: dbSubscription.planName,
        endDate: new Date(subscription.current_period_end * 1000).toISOString()
      });
    }

    console.log('Subscription cancelled:', subscription.id);
  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    // Update subscription with successful payment
    await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: invoice.subscription as string
      },
      data: {
        status: 'active',
        expiryDate: new Date((invoice.period_end || 0) * 1000),
        currentPeriodEnd: new Date((invoice.period_end || 0) * 1000)
      }
    });

    console.log('Payment succeeded for subscription:', invoice.subscription);
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    // Mark subscription as past due
    await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: invoice.subscription as string
      },
      data: {
        status: 'past_due'
      }
    });

    console.log('Payment failed for subscription:', invoice.subscription);
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}