import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Add a new blocked date
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, reason } = body;

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
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

    // Check if date is already blocked
    const existingBlock = await prisma.blockedDate.findFirst({
      where: {
        blockedDate: dateObj,
      },
    });

    if (existingBlock) {
      return NextResponse.json(
        { error: 'Date is already blocked' },
        { status: 409 }
      );
    }

    // Create new blocked date
    const blockedDate = await prisma.blockedDate.create({
      data: {
        blockedDate: dateObj,
        reason: reason || null,
      },
    });

    return NextResponse.json({
      message: 'Date blocked successfully',
      blockedDate: {
        id: blockedDate.id,
        date: blockedDate.blockedDate.toISOString().split('T')[0],
        reason: blockedDate.reason,
        createdAt: blockedDate.createdAt,
      },
    });
  } catch (error) {
    console.error('Error blocking date:', error);
    return NextResponse.json(
      { error: 'Failed to block date' },
      { status: 500 }
    );
  }
}

// GET - Get all blocked dates
export async function GET() {
  try {
    const blockedDates = await prisma.blockedDate.findMany({
      orderBy: {
        blockedDate: 'asc',
      },
    });

    const formattedDates = blockedDates.map((item: { id: string; blockedDate: Date; reason: string | null; createdAt: Date }) => ({
      id: item.id,
      date: item.blockedDate.toISOString().split('T')[0],
      reason: item.reason,
      createdAt: item.createdAt,
    }));

    return NextResponse.json(formattedDates);
  } catch (error) {
    console.error('Error fetching blocked dates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blocked dates' },
      { status: 500 }
    );
  }
}