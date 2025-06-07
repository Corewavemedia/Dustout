import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

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

    // Parse the request body
    const bookingData = await request.json();
    
    // Extract booking details
    const {
      fullName,
      phone,
      email,
      serviceAddress,
      cityState,
      postCode,
      landmark,
      serviceTypes,
      serviceFrequency,
      bedrooms,
      bathrooms,
      preferredDate,
      startTime,
      endTime,
      urgent,
      specialNotes
    } = bookingData;

    // Validate required fields
    if (!fullName || !phone || !email || !serviceAddress || !serviceTypes || !serviceFrequency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert serviceTypes array to string if it's an array
    const serviceTypesString = Array.isArray(serviceTypes) 
      ? serviceTypes.join(', ') 
      : serviceTypes;

    // Create the booking in the database
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        fullName,
        phone,
        email,
        serviceAddress,
        cityState: cityState || null,
        postCode: postCode || null,
        landmark: landmark || null,
        serviceTypes: serviceTypesString,
        serviceFrequency,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        preferredDate: preferredDate || null,
        startTime: startTime || null,
        endTime: endTime || null,
        isUrgent: urgent || 'No',
        notes: specialNotes || null,
      },
    });

    return NextResponse.json(
      { 
        message: 'Booking created successfully',
        bookingId: booking.id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET method to retrieve user's bookings
export async function GET(request: NextRequest) {
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

    // Get user's bookings
    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ bookings }, { status: 200 });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}