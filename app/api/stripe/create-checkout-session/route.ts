import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the user with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { bookingData } = await request.json();

    // Validate booking data
    if (!bookingData || !bookingData.estimatedPrice) {
      return NextResponse.json(
        { error: 'Invalid booking data' },
        { status: 400 }
      );
    }

    // Generate a unique booking reference ID
    const bookingRef = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store booking data temporarily in database with the reference ID
    await prisma.tempBookingData.create({
      data: {
        referenceId: bookingRef,
        bookingData: JSON.stringify(bookingData),
        userId: user.id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
      },
    });

    // Store essential metadata only (within 500 char limit)
    const essentialMetadata = {
      userId: user.id,
      customerName: bookingData.fullName,
      customerEmail: bookingData.email,
      estimatedPrice: bookingData.estimatedPrice.toString(),
      serviceCount: bookingData.selectedServices.length.toString(),
    };

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'DustOut Cleaning Service',
              description: `Booking for ${bookingData.fullName} - ${bookingData.selectedServices.length} service(s)`,
            },
            unit_amount: Math.round(bookingData.estimatedPrice * 100), // Convert to pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?payment=cancelled`,
      metadata: essentialMetadata,
      // Use short booking reference ID instead of full data
      client_reference_id: bookingRef,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}