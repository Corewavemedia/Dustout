import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all blocked dates from admin
    const blockedDates = await prisma.blockedDate.findMany({
      select: {
        blockedDate: true,
      },
    });

    // Only use blocked dates and past dates for client-side unavailability
    const unavailableDates = new Set<string>();

    // Add admin-blocked dates
    blockedDates.forEach((item: { blockedDate: Date }) => {
      const dateStr = item.blockedDate.toISOString().split('T')[0];
      unavailableDates.add(dateStr);
    });

    // Add past dates (automatically blacklist past dates)
    const today = new Date();
    for (let i = 1; i <= 365; i++) { // Block past year
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - i);
      const dateStr = pastDate.toISOString().split('T')[0];
      unavailableDates.add(dateStr);
    }

    return NextResponse.json(Array.from(unavailableDates).sort());
  } catch (error) {
    console.error('Error fetching unavailable dates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unavailable dates' },
      { status: 500 }
    );
  }
}