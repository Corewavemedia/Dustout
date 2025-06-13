import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch dashboard statistics
export async function GET() {
  try {
    // Calculate total revenue from bookings
    const bookingServices = await prisma.booking.findMany({
      select: {
        estimatedPrice: true
      }
    });
    
    const bookingRevenue = bookingServices.reduce((total, service) => {
      return total + (service.estimatedPrice || 0);
    }, 0);

    // Calculate total revenue from subscriptions
    const subscriptions = await prisma.subscription.findMany({
      select: {
        revenue: true
      }
    });
    
    const subscriptionRevenue = subscriptions.reduce((total, subscription) => {
      return total + (subscription.revenue || 0);
    }, 0);

    // Total revenue
    const totalRevenue = bookingRevenue + subscriptionRevenue;

    // Get unique clients from bookings
    const bookingClients = await prisma.booking.findMany({
      select: {
        userId: true
      },
      distinct: ['userId']
    });

    // Get unique clients from subscriptions
    const subscriptionClients = await prisma.subscription.findMany({
      select: {
        userId: true
      },
      distinct: ['userId']
    });

    // Combine and get unique client IDs
    const allClientIds = new Set([
      ...bookingClients.map(b => b.userId),
      ...subscriptionClients.map(s => s.userId)
    ]);
    
    const totalClients = allClientIds.size;

    // Get total number of bookings
    const totalBookings = await prisma.booking.count();

    const stats = {
      revenue: totalRevenue,
      clients: totalClients,
      bookings: totalBookings
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}