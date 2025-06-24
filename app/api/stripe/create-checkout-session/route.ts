import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


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

    // Storing essential booking data in metadata (optimized for 500 char limit)
    const metadata = {
      userId: user.id,
      fullName: bookingData.fullName,
      phone: bookingData.phone,
      email: bookingData.email,
      address: bookingData.address,
      city: bookingData.city,
      postcode: bookingData.postcode,
      landmark: bookingData.landmark || '',
      frequency: bookingData.frequency,
      preferredDate: bookingData.preferredDate,
      preferredTime: bookingData.preferredTime,
      urgent: bookingData.urgent,
      specialInstructions: bookingData.specialInstructions || '',
      estimatedPrice: bookingData.estimatedPrice.toString(),
      servicesData: JSON.stringify(bookingData.selectedServices),
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}&order_id=${bookingRef}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?payment=cancelled`,
      metadata: metadata,
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