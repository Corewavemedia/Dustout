import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil'
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

    // Find the user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: dbUser.id,
        status: 'active'
      }
    });

    if (!subscription || !subscription.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Create a Stripe setup session for updating payment method
    const session = await stripe.checkout.sessions.create({
      customer: subscription.stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'setup',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment_method=updated`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment_method=cancelled`,
      metadata: {
        userId: dbUser.id,
        subscriptionId: subscription.id
      }
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Payment method update error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment method update session' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve current payment method
export async function GET(request: NextRequest) {
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

    // Find the user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: dbUser.id,
        status: 'active'
      }
    });

    if (!subscription || !subscription.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Get the customer's default payment method from Stripe
    const customer = await stripe.customers.retrieve(subscription.stripeCustomerId) as Stripe.Customer;
    
    if (!customer.invoice_settings?.default_payment_method) {
      return NextResponse.json({
        paymentMethod: null
      });
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(
      customer.invoice_settings.default_payment_method as string
    );

    return NextResponse.json({
      paymentMethod: {
        id: paymentMethod.id,
        type: paymentMethod.type,
        card: paymentMethod.card ? {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          exp_month: paymentMethod.card.exp_month,
          exp_year: paymentMethod.card.exp_year
        } : null
      }
    });

  } catch (error) {
    console.error('Get payment method error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payment method' },
      { status: 500 }
    );
  }
}