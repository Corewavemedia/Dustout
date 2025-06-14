import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function PUT(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the user with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get the subscription ID from the query parameters
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscriptionId');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
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

    // Get cancellation preference from request body
    const body = await request.json();
    const { cancelAtPeriodEnd = true } = body;

    // Find the subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: dbUser.id,
        status: 'active'
      }
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Active subscription not found' },
        { status: 404 }
      );
    }

    if (!subscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'Stripe subscription ID not found' },
        { status: 400 }
      );
    }

    // Cancel the subscription in Stripe
    let stripeSubscription;
    if (cancelAtPeriodEnd) {
      // Cancel at the end of the current billing period
      stripeSubscription = await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        {
          cancel_at_period_end: true,
          metadata: {
            cancelledBy: 'customer',
            cancelledAt: new Date().toISOString()
          }
        }
      );
    } else {
      // Cancel immediately
      stripeSubscription = await stripe.subscriptions.cancel(
        subscription.stripeSubscriptionId,
        {
          prorate: true
        }
      );
    }

    // Calculate correct dates
    const currentPeriodEnd = new Date(stripeSubscription.items.data[0].current_period_end * 1000);
    const expiryDate = cancelAtPeriodEnd ? currentPeriodEnd : new Date();

    // Update subscription in database
    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: subscriptionId
      },
      data: {
        status: cancelAtPeriodEnd ? 'cancelling' : 'cancelled',
        cancelledAt: cancelAtPeriodEnd ? null : new Date(),
        cancelAtPeriodEnd: cancelAtPeriodEnd,
        currentPeriodEnd: currentPeriodEnd,
        expiryDate: expiryDate
      }
    });

    return NextResponse.json({
      success: true,
      message: cancelAtPeriodEnd 
        ? 'Subscription will be cancelled at the end of the current billing period'
        : 'Subscription cancelled immediately',
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        cancelledAt: updatedSubscription.cancelledAt,
        cancelAtPeriodEnd: updatedSubscription.cancelAtPeriodEnd,
        currentPeriodEnd: updatedSubscription.currentPeriodEnd,
        expiryDate: updatedSubscription.expiryDate
      }
    });

  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}