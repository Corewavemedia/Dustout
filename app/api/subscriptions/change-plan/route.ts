import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { sendSubscriptionUpgradeEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verify the user with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get the request body
    const { newPlanId, newPlanName, newPlanType, newPrice } = await request.json();

    if (!newPlanId || !newPlanName || !newPlanType || !newPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the user in our database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Find the user's current active subscription
    const currentSubscription = await prisma.subscription.findFirst({
      where: {
        userId: dbUser.id,
        status: 'active'
      }
    });

    if (!currentSubscription || !currentSubscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Find the new subscription plan
    const newSubscriptionPlan = await prisma.subscriptionPlan.findUnique({
      where: { id: newPlanId }
    });

    if (!newSubscriptionPlan) {
      return NextResponse.json(
        { error: 'New subscription plan not found' },
        { status: 404 }
      );
    }

    // Get the current Stripe subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(
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

    // Create new Stripe price
    const newStripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(newPrice * 100), // Convert to cents
      currency: 'gbp',
      recurring: {
        interval: 'month'
      },
      metadata: {
        planId: newPlanId,
        planType: newPlanType
      }
    });

    // Determine if this is an upgrade or downgrade
    const isUpgrade = newPrice > currentSubscription.revenue;
    let updatedStripeSubscription;
    let message;

    if (isUpgrade) {
      // For upgrades: Cancel current subscription and create new one with full billing
      console.log('Upgrading subscription - canceling current and creating new:', currentSubscription.stripeSubscriptionId);
      
      // Get the customer and their default payment method before cancelling
      const customerId = typeof stripeSubscription.customer === 'string' ? stripeSubscription.customer : stripeSubscription.customer.id;
      const customer = await stripe.customers.retrieve(customerId);
      
      // Check if customer has a payment method (either default or any attached)
      let hasPaymentMethod = false;
      if (customer && !customer.deleted) {
        if (customer.invoice_settings?.default_payment_method) {
          hasPaymentMethod = true;
        } else {
          // Check if customer has any payment methods attached
          const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: 'card'
          });
          hasPaymentMethod = paymentMethods.data.length > 0;
          
          // If we have payment methods but no default, set the first one as default
          if (hasPaymentMethod && paymentMethods.data.length > 0) {
            await stripe.customers.update(customerId, {
              invoice_settings: {
                default_payment_method: paymentMethods.data[0].id
              }
            });
            // Refresh customer data
            const updatedCustomer = await stripe.customers.retrieve(customerId);
            Object.assign(customer, updatedCustomer);
          }
        }
      }
      
      if (!hasPaymentMethod) {
        // Customer needs to add a payment method first
        const setupSession = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ['card'],
          mode: 'setup',
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment_method=updated&retry_plan_change=true&plan_id=${newPlanId}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment_method=cancelled`,
          metadata: {
            userId: dbUser.id,
            subscriptionId: currentSubscription.id,
            pendingPlanChange: 'true',
            newPlanId: newPlanId,
            newPlanName: newPlanName,
            newPlanType: newPlanType,
            newPrice: newPrice.toString()
          }
        });
        
        return NextResponse.json({
          requiresPaymentMethod: true,
          setupUrl: setupSession.url,
          message: 'Please add a payment method to upgrade your subscription'
        });
      }
      
      // Cancel the current subscription immediately
      await stripe.subscriptions.cancel(currentSubscription.stripeSubscriptionId, {
        prorate: false
      });

      // Create a new subscription with the new plan (full price billing)
      const subscriptionParams: Stripe.SubscriptionCreateParams = {
        customer: customerId,
        items: [{
          price: newStripePrice.id,
        }],
        metadata: {
          planId: newPlanId,
          planName: newPlanName,
          planType: newPlanType,
          upgradedAt: new Date().toISOString(),
          previousPlanId: currentSubscription.planId,
          isUpgrade: 'true'
        },
        default_payment_method: customer && !('deleted' in customer) && customer.invoice_settings?.default_payment_method ? customer.invoice_settings.default_payment_method as string : undefined
      };
      
      updatedStripeSubscription = await stripe.subscriptions.create(subscriptionParams);

      message = `Subscription upgraded successfully. You have been charged the full price for the new plan and it is now active.`;
    } else {
      // For downgrades: Set current subscription to cancel at period end and create new subscription
      console.log('Downgrading subscription - scheduling cancellation and creating new subscription');
      
      // Set current subscription to cancel at the end of the period
      await stripe.subscriptions.update(
        currentSubscription.stripeSubscriptionId,
        {
          cancel_at_period_end: true,
          metadata: {
            downgradedAt: new Date().toISOString(),
            newPlanId: newPlanId,
            newPlanName: newPlanName,
            newPlanType: newPlanType,
            newPrice: newPrice.toString()
          }
        }
      );

      // Get the customer and their default payment method for the new subscription
      const customerId = typeof stripeSubscription.customer === 'string' ? stripeSubscription.customer : stripeSubscription.customer.id;
      const customer = await stripe.customers.retrieve(customerId);
      
      // Check if customer has a payment method (either default or any attached)
      let hasPaymentMethod = false;
      if (customer && !customer.deleted) {
        if (customer.invoice_settings?.default_payment_method) {
          hasPaymentMethod = true;
        } else {
          // Check if customer has any payment methods attached
          const paymentMethods = await stripe.paymentMethods.list({
            customer: customerId,
            type: 'card'
          });
          hasPaymentMethod = paymentMethods.data.length > 0;
          
          // If we have payment methods but no default, set the first one as default
          if (hasPaymentMethod && paymentMethods.data.length > 0) {
            await stripe.customers.update(customerId, {
              invoice_settings: {
                default_payment_method: paymentMethods.data[0].id
              }
            });
            // Refresh customer data
            const updatedCustomer = await stripe.customers.retrieve(customerId);
            Object.assign(customer, updatedCustomer);
          }
        }
      }
      
      if (!hasPaymentMethod) {
        // Customer needs to add a payment method first
        const setupSession = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ['card'],
          mode: 'setup',
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment_method=updated&retry_plan_change=true&plan_id=${newPlanId}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment_method=cancelled`,
          metadata: {
            userId: dbUser.id,
            subscriptionId: currentSubscription.id,
            pendingPlanChange: 'true',
            newPlanId: newPlanId,
            newPlanName: newPlanName,
            newPlanType: newPlanType,
            newPrice: newPrice.toString()
          }
        });
        
        return NextResponse.json({
          requiresPaymentMethod: true,
          setupUrl: setupSession.url,
          message: 'Please add a payment method to change your subscription'
        });
      }
      
      // Create a new subscription that starts when the current one ends
      const currentPeriodEnd = stripeSubscription.items.data[0].current_period_end;
      const downgradeSubscriptionParams: Stripe.SubscriptionCreateParams = {
        customer: customerId,
        items: [{
          price: newStripePrice.id,
        }],
        billing_cycle_anchor: currentPeriodEnd, // Start when current subscription ends
        trial_end: currentPeriodEnd, // Ensure it doesn't start immediately
        metadata: {
          planId: newPlanId,
          planName: newPlanName,
          planType: newPlanType,
          downgradedAt: new Date().toISOString(),
          previousPlanId: currentSubscription.planId,
          isDowngrade: 'true'
        },
        default_payment_method: customer && !('deleted' in customer) && customer.invoice_settings?.default_payment_method ? customer.invoice_settings.default_payment_method as string : undefined
      };
      
      updatedStripeSubscription = await stripe.subscriptions.create(downgradeSubscriptionParams);

      message = `Subscription downgrade scheduled. You will bw charged on ${new Date(currentPeriodEnd * 1000).toLocaleDateString()} when your current billing period ends, after which the new subscription will take effect.`;
    }

    // Update subscription in database using transaction
    let updatedSubscription;
    
    if (isUpgrade) {
      // For upgrades: Mark old subscription as cancelled and create new one
      console.log('Processing upgrade - marking old subscription as cancelled and creating new one');
      
      // Mark the old subscription as cancelled
      await prisma.subscription.update({
        where: {
          id: currentSubscription.id
        },
        data: {
          status: 'cancelled',
          cancelAtPeriodEnd: false,
          expiryDate: new Date() // Cancelled immediately
        }
      });

      // Create new subscription record for the upgrade
      updatedSubscription = await prisma.subscription.create({
        data: {
          userId: currentSubscription.userId,
          planId: newPlanId,
          planName: `${newPlanName} (${newPlanType})`,
          planType: newPlanType,
          revenue: newPrice,
          stripeCustomerId: currentSubscription.stripeCustomerId,
          stripeSubscriptionId: updatedStripeSubscription.id,
          currentPeriodStart: new Date(updatedStripeSubscription.items.data[0].current_period_start * 1000),
          currentPeriodEnd: new Date(updatedStripeSubscription.items.data[0].current_period_end * 1000),
          startDate: new Date(),
          expiryDate: new Date(updatedStripeSubscription.items.data[0].current_period_end * 1000),
          status: 'active',
          cancelAtPeriodEnd: false
        }
      });
      
      console.log('Upgrade completed successfully - new subscription created:', updatedSubscription.id);
    } else {
      // For downgrades: Mark current subscription to cancel at period end, create new subscription for later
      console.log('Processing downgrade - scheduling current subscription cancellation and creating future subscription');
      
      // Update current subscription to cancel at period end
      await prisma.subscription.update({
        where: {
          id: currentSubscription.id
        },
        data: {
          cancelAtPeriodEnd: true,
          expiryDate: new Date(stripeSubscription.items.data[0].current_period_end * 1000)
        }
      });

      // Create new subscription record that will become active when current one ends
      const scheduledStartDate = new Date(stripeSubscription.items.data[0].current_period_end * 1000);
      const scheduledExpiryDate = new Date(scheduledStartDate);
      scheduledExpiryDate.setMonth(scheduledExpiryDate.getMonth() + 1); // Add one month to start date
      
      updatedSubscription = await prisma.subscription.create({
        data: {
          userId: currentSubscription.userId,
          planId: newPlanId,
          planName: `${newPlanName} (${newPlanType})`,
          planType: newPlanType,
          revenue: newPrice,
          stripeCustomerId: currentSubscription.stripeCustomerId,
          stripeSubscriptionId: updatedStripeSubscription.id,
          currentPeriodStart: scheduledStartDate, // Should match start date for pending subscription
          currentPeriodEnd: scheduledExpiryDate, // Should match expiry date for pending subscription
          startDate: scheduledStartDate, // Starts when current ends
          expiryDate: scheduledExpiryDate, // One month after start date
          status: 'pending', // Will become active when current subscription ends
          cancelAtPeriodEnd: false
        }
      });
      
      console.log('Downgrade scheduled successfully - new subscription created:', updatedSubscription.id);
    }

    // Send upgrade/downgrade email
    await sendSubscriptionUpgradeEmail({
      to: user.email!,
      customerName: dbUser.fullname || user.email!.split('@')[0],
      subscriptionId: updatedSubscription.id,
      oldPlanName: currentSubscription.planName,
      newPlanName: `${newPlanName} (${newPlanType})`,
      newPrice: newPrice,
      isUpgrade: isUpgrade,
      effectiveDate: new Date().toISOString(),
      nextBillingDate: updatedSubscription.expiryDate.toISOString(),
      features: newSubscriptionPlan.features
    });

    return NextResponse.json({
      success: true,
      message: message,
      subscription: {
        id: updatedSubscription.id,
        planId: updatedSubscription.planId,
        planName: updatedSubscription.planName,
        startDate: updatedSubscription.startDate,
        expiryDate: updatedSubscription.expiryDate,
        status: updatedSubscription.status,
        revenue: updatedSubscription.revenue,
        email: updatedSubscription.email,
        stripeSubscriptionId: updatedSubscription.stripeSubscriptionId,
        stripeCustomerId: updatedSubscription.stripeCustomerId,
        planType: updatedSubscription.planType,
        currentPeriodStart: updatedSubscription.currentPeriodStart,
        currentPeriodEnd: updatedSubscription.currentPeriodEnd,
        cancelAtPeriodEnd: updatedSubscription.cancelAtPeriodEnd
      }
    });

  } catch (error) {
    console.error('Subscription plan change error:', error);
    return NextResponse.json(
      { error: 'Failed to change subscription plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}