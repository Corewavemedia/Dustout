import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

interface ChangePlanRequest {
  newPlanId: string;
  newPlanName: string;
  newPlanType: 'residential' | 'industrial';
  newPrice: number;
}

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
    const body: ChangePlanRequest = await request.json();
    const { newPlanId, newPlanName, newPlanType, newPrice } = body;

    // Validate required fields
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

    if (!currentSubscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Check if this is an upgrade (requires payment) or downgrade (immediate)
    const isUpgrade = newPrice > currentSubscription.revenue;
    
    // For downgrades, we can process immediately without payment
    if (!isUpgrade) {
      return NextResponse.json(
        { 
          requiresPayment: false,
          message: 'Downgrade will be processed immediately',
          isUpgrade: false
        }
      );
    }

    // For upgrades, create a checkout session
    // Get or create Stripe customer
    let stripeCustomer;
    const existingCustomers = await stripe.customers.list({
      email: user.email!,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      stripeCustomer = existingCustomers.data[0];
    } else {
      stripeCustomer = await stripe.customers.create({
        email: user.email!,
        name: dbUser.fullname || user.email!.split('@')[0],
        metadata: {
          userId: dbUser.id,
          planType: newPlanType
        }
      });
    }

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

    // Create a recurring price for the full new plan amount
    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(newPrice * 100), // Convert to cents - full price
      currency: 'gbp',
      recurring: {
        interval: 'month'
      },
      metadata: {
        planId: newPlanId,
        planType: newPlanType,
        isUpgrade: 'true',
        originalSubscriptionId: currentSubscription.id.toString()
      }
    });

    // Create checkout session for the upgrade payment
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      mode: 'subscription', // Recurring subscription for upgrade
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?upgrade=cancelled`,
      metadata: {
        userId: dbUser.id,
        currentSubscriptionId: currentSubscription.id.toString(),
        newPlanId: newPlanId,
        newPlanName: newPlanName,
        newPlanType: newPlanType,
        newPrice: newPrice.toString(),
        isUpgrade: 'true',
        userEmail: user.email!
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required'
    });

    return NextResponse.json({
      requiresPayment: true,
      sessionId: session.id,
      url: session.url,
      isUpgrade: true,
      newPrice: newPrice
    });

  } catch (error) {
    console.error('Subscription plan change checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session for plan change' },
      { status: 500 }
    );
  }
}