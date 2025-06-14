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
      // For upgrades: Cancel current subscription and create new one with full price
      await stripe.subscriptions.cancel(currentSubscription.stripeSubscriptionId, {
        prorate: true
      });

      // Create new subscription with full price
      const customer = await stripe.customers.retrieve(currentSubscription.stripeCustomerId!);
      
      updatedStripeSubscription = await stripe.subscriptions.create({
        customer: currentSubscription.stripeCustomerId!,
        items: [{
          price: newStripePrice.id,
        }],
        metadata: {
          planId: newPlanId,
          planName: newPlanName,
          planType: newPlanType,
          upgradedAt: new Date().toISOString(),
          previousSubscriptionId: currentSubscription.stripeSubscriptionId
        }
      });

      message = `Subscription upgraded successfully. You have been charged the full price of £${newPrice} for the new plan.`;
    } else {
      // For downgrades: Schedule the change for the end of current period
      updatedStripeSubscription = await stripe.subscriptions.update(
        currentSubscription.stripeSubscriptionId,
        {
          items: [{
            id: stripeSubscription.items.data[0].id,
            price: newStripePrice.id,
          }],
          proration_behavior: 'none', // No proration for downgrades
          billing_cycle_anchor: 'unchanged', // Keep current billing cycle
          metadata: {
            planId: newPlanId,
            planName: newPlanName,
            planType: newPlanType,
            downgradedAt: new Date().toISOString(),
            effectiveDate: new Date(stripeSubscription.items.data[0].current_period_end * 1000).toISOString()
          }
        }
      );

      message = `Subscription downgrade scheduled. Your new plan will take effect on ${new Date(stripeSubscription.items.data[0].current_period_end * 1000).toLocaleDateString()} at the end of your current billing period.`;
    }

    // Update subscription in database
    let updatedSubscription;
    
    if (isUpgrade) {
      // For upgrades: Update current subscription with new plan details immediately
      updatedSubscription = await prisma.subscription.update({
        where: {
          id: currentSubscription.id
        },
        data: {
          planId: newPlanId,
          planName: `${newPlanName} (${newPlanType})`,
          revenue: newPrice,
          stripeSubscriptionId: updatedStripeSubscription.id,
          startDate: new Date(updatedStripeSubscription.start_date * 1000),
          currentPeriodStart: new Date(updatedStripeSubscription.items.data[0].current_period_start * 1000),
        currentPeriodEnd: new Date(updatedStripeSubscription.items.data[0].current_period_end * 1000),
        expiryDate: updatedStripeSubscription.ended_at ? new Date(updatedStripeSubscription.ended_at * 1000) : new Date(updatedStripeSubscription.items.data[0].current_period_end * 1000)
        }
      });
    } else {
      // For downgrades: Keep current plan active, schedule change for next period
      updatedSubscription = await prisma.subscription.update({
        where: {
          id: currentSubscription.id
        },
        data: {
          // Keep current plan details, add metadata about scheduled downgrade
          currentPeriodEnd: new Date(updatedStripeSubscription.items.data[0].current_period_end * 1000),
        expiryDate: new Date(updatedStripeSubscription.items.data[0].current_period_end * 1000)
          // Note: Plan details will be updated by webhook when the period ends
        }
      });
      
      // Store the scheduled downgrade information
      await prisma.subscription.update({
        where: {
          id: currentSubscription.id
        },
        data: {
          // Add a note or flag that this subscription has a scheduled downgrade
          // This could be handled via a separate table or metadata field
        }
      });
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
      { error: 'Failed to change subscription plan' },
      { status: 500 }
    );
  }
}