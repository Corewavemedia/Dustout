import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all booking dates with count for admin calendar
    const bookings = await prisma.booking.findMany({
      where: {
        preferredDate: {
          not: null,
        },
      },
      select: {
        preferredDate: true,
      },
    });

    // Count bookings per date
    const bookingCounts: { [key: string]: number } = {};
    
    bookings.forEach((booking) => {
      if (booking.preferredDate) {
        try {
          const date = new Date(booking.preferredDate);
          if (!isNaN(date.getTime())) {
            const dateStr = date.toISOString().split('T')[0];
            bookingCounts[dateStr] = (bookingCounts[dateStr] || 0) + 1;
          }
        } catch {
          console.warn('Invalid date format in booking:', booking.preferredDate);
        }
      }
    });

    return NextResponse.json(bookingCounts);
  } catch (error) {
    console.error('Error fetching booking dates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking dates' },
      { status: 500 }
    );
  }
}