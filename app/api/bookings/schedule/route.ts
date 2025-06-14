import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { sendSchedulingConfirmationEmail } from '@/lib/email';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(request: NextRequest) {
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

    const { bookingId, staffId, scheduledDate, scheduledTime } = await request.json();

    // Validate required fields
    if (!bookingId || !staffId || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { error: 'Missing required fields: bookingId, staffId, scheduledDate, scheduledTime' },
        { status: 400 }
      );
    }

    // Update the booking with scheduling information
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        staffId,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        status: 'scheduled',
      },
      include: {
        services: {
          include: {
            service: true,
          },
        },
        staff: true,
      },
    });

    // Get staff information
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    // Prepare services data for email
    const servicesForEmail = updatedBooking.services.map(bs => ({
      serviceName: bs.serviceName,
      selectedVariables: [{
        variableName: bs.variableName,
        variableValue: bs.variableValue,
      }],
    }));

    // Send scheduling confirmation email to customer
    console.log('Attempting to send scheduling confirmation email to:', updatedBooking.email);
    console.log('Email data:', {
      to: updatedBooking.email,
      customerName: updatedBooking.fullName,
      bookingId: updatedBooking.id,
      scheduledDate: scheduledDate,
      scheduledTime: scheduledTime,
      assignedStaff: `${staff.firstName} ${staff.lastName}`,
      services: servicesForEmail,
      address: `${updatedBooking.address}, ${updatedBooking.city}, ${updatedBooking.postcode}`,
    });
    
    try {
      const emailResult = await sendSchedulingConfirmationEmail({
        to: updatedBooking.email,
        customerName: updatedBooking.fullName,
        bookingId: updatedBooking.id,
        scheduledDate: scheduledDate,
        scheduledTime: scheduledTime,
        assignedStaff: `${staff.firstName} ${staff.lastName}`,
        services: servicesForEmail,
        address: `${updatedBooking.address}, ${updatedBooking.city}, ${updatedBooking.postcode}`,
      });
      console.log('Scheduling confirmation email sent successfully:', emailResult);
    } catch (emailError) {
      console.error('Error sending scheduling confirmation email:', emailError);
      console.error('Email error details:', JSON.stringify(emailError, null, 2));
      // Don't fail the API call if email fails
    }

    return NextResponse.json({
      message: 'Booking scheduled successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Error scheduling booking:', error);
    return NextResponse.json(
      { error: 'Failed to schedule booking' },
      { status: 500 }
    );
  }
}