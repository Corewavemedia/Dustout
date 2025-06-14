import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

interface CheckoutRequest {
  planId: string;
  planName: string;
  planType: 'residential' | 'industrial';
  price: number;
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
    const body: CheckoutRequest = await request.json();
    const { planId, planName, planType, price } = body;

    // Validate required fields
    if (!planId || !planName || !planType || !price) {
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

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: dbUser.id,
        status: 'active'
      }
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'User already has an active subscription' },
        { status: 400 }
      );
    }

    // Create or get Stripe customer
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
          planType: planType
        }
      });
    }

    // Create Stripe product if it doesn't exist
    const products = await stripe.products.list({
      active: true,
      limit: 100
    });

    let product = products.data.find(p => p.metadata.planId === planId);
    
    if (!product) {
      product = await stripe.products.create({
        name: `${planName} - ${planType.charAt(0).toUpperCase() + planType.slice(1)}`,
        description: `DustOut ${planType} subscription plan`,
        metadata: {
          planId: planId,
          planType: planType
        }
      });
    }

    // Create Stripe price
    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(price * 100), // Convert to cents
      currency: 'gbp',
      recurring: {
        interval: 'month'
      },
      metadata: {
        planId: planId,
        planType: planType
      }
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/#pricing`,
      metadata: {
        userId: dbUser.id,
        planId: planId,
        planName: planName,
        planType: planType,
        userEmail: user.email!
      },
      subscription_data: {
        metadata: {
          userId: dbUser.id,
          planId: planId,
          planName: planName,
          planType: planType
        }
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required'
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Stripe checkout session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}