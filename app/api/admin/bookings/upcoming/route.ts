import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {

    // Fetch the most recent booking without assigned staff
    const upcomingBooking = await prisma.booking.findFirst({
      where: {
        staffId: null, // No staff assigned
      },
      orderBy: {
        createdAt: 'asc', // Earliest booking first
      },
      include: {
        user: true,
        staff: true,
        services: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!upcomingBooking) {
      return NextResponse.json({ message: 'No unassigned bookings found' }, { status: 404 });
    }

    // Format the booking data for the frontend
    const formattedBooking = {
      id: upcomingBooking.id,
      clientName: upcomingBooking.fullName || 'Unknown Client',
      service: upcomingBooking.services.length > 0 
        ? upcomingBooking.services.map(s => s.service.name).join(', ')
        : 'No services',
      date: upcomingBooking.preferredDate || 'Date not specified',
      time: upcomingBooking.startTime && upcomingBooking.endTime 
        ? `${upcomingBooking.startTime}-${upcomingBooking.endTime}`
        : 'Time not specified',
      staff: upcomingBooking.staff ? `${upcomingBooking.staff.firstName} ${upcomingBooking.staff.lastName}` : 'Not Assigned',
      address: upcomingBooking.serviceAddress || 'Address not provided',
    };

    return NextResponse.json(formattedBooking);
  } catch (error) {
    console.error('Error fetching upcoming booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}