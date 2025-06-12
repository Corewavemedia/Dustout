import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE - Remove a blocked date
export async function DELETE(
  { params }: { params: { date: string } }
) {
  try {
    const { date } = params;

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Find and delete the blocked date
    const deletedDate = await prisma.blockedDate.deleteMany({
      where: {
        blockedDate: dateObj,
      },
    });

    if (deletedDate.count === 0) {
      return NextResponse.json(
        { error: 'Blocked date not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Date unblocked successfully',
      date: date,
    });
  } catch (error) {
    console.error('Error unblocking date:', error);
    return NextResponse.json(
      { error: 'Failed to unblock date' },
      { status: 500 }
    );
  }
}