import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

interface SubscriptionRequest {
  planName: string;
  planType: 'residential' | 'industrial';
  price: string;
  paymentMethod: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
  billingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
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
    const body: SubscriptionRequest = await request.json();
    const {
      planName,
      planType,
      price,
      paymentMethod,
      billingAddress
    } = body;

    // Validate required fields
    if (!planName || !planType || !price || !paymentMethod || !billingAddress) {
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

    // Calculate dates
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1); // Add 1 month

    // In a real application, you would:
    // 1. Process payment with Stripe/PayPal
    // 2. Validate payment details
    // 3. Handle payment failures
    
    // For demo purposes, we'll simulate successful payment processing
    // and create the subscription record

    // Find a matching subscription plan
    const subscriptionPlan = await prisma.subscriptionPlan.findFirst({
      where: {
        name: planName,
        type: planType,
        isActive: true
      }
    });

    if (!subscriptionPlan) {
      return NextResponse.json(
        { error: 'Subscription plan not found' },
        { status: 404 }
      );
    }

    // Create the subscription in the database
    const subscription = await prisma.subscription.create({
      data: {
        userId: dbUser.id,
        planId: subscriptionPlan.id,
        planName: `${planName} (${planType})`,
        startDate,
        expiryDate,
        status: 'active',
        revenue: parseFloat(price),
        email: user.email!,
        phone: dbUser.phone || undefined
      }
    });

    // Update user's address if provided
    if (billingAddress.street && billingAddress.city) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          address: `${billingAddress.street}, ${billingAddress.city}, ${billingAddress.postalCode}, ${billingAddress.country}`
        }
      });
    }

    // In a real application, you would also:
    // 1. Send confirmation email
    // 2. Set up recurring billing
    // 3. Activate user's subscription features
    // 4. Log the transaction

    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully',
      subscription: {
        id: subscription.id,
        planName: subscription.planName,
        startDate: subscription.startDate,
        expiryDate: subscription.expiryDate,
        status: subscription.status,
        revenue: subscription.revenue
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}