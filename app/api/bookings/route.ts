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
      services,
      serviceFrequency,
      preferredDate,
      startTime,
      endTime,
      urgent,
      specialNotes,
      estimatedPrice
    } = bookingData;

    // Validate required fields
    if (!fullName || !phone || !email || !serviceAddress || !services || !serviceFrequency) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(services) || services.length === 0) {
      return NextResponse.json(
        { error: 'At least one service must be selected' },
        { status: 400 }
      );
    }

    // Create the booking with services in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      // Create the main booking
      const newBooking = await tx.booking.create({
        data: {
          userId: user.id,
          fullName,
          phone,
          email,
          serviceAddress,
          cityState: cityState || null,
          postCode: postCode || null,
          landmark: landmark || null,
          serviceFrequency,
          preferredDate: preferredDate || null,
          startTime: startTime || null,
          endTime: endTime || null,
          isUrgent: urgent || 'No',
          notes: specialNotes || null,
          estimatedPrice: estimatedPrice || null,
        },
      });

      // Create booking services
      for (const service of services) {
        // Get the service data
        const serviceData = await tx.service.findUnique({
          where: { id: service.serviceId },
          include: { variables: true }
        });

        if (!serviceData) {
          throw new Error(`Service with ID ${service.serviceId} not found`);
        }

        // Create booking services for each variable in the service
        for (const serviceVariable of service.variables) {
          // Find the corresponding variable in the service data
          const variable = serviceData.variables.find(v => v.id === serviceVariable.variableId);
          if (!variable) {
            throw new Error(`Variable with ID ${serviceVariable.variableId} not found for service ${serviceData.name}`);
          }

          await tx.bookingService.create({
            data: {
              bookingId: newBooking.id,
              serviceId: service.serviceId,
              quantity: serviceVariable.quantity,
              unitPrice: variable.unitPrice
            }
          });
        }
      }

      return newBooking;
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