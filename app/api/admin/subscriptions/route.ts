import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all subscriptions
export async function GET() {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullname: true,
            address: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to match the frontend interface
    const transformedSubscriptions = subscriptions.map(subscription => ({
      id: subscription.id,
      clientName: subscription.user.fullname || subscription.user.username,
      planName: subscription.planName,
      startDate: subscription.startDate.toISOString().split('T')[0],
      expiryDate: subscription.expiryDate.toISOString().split('T')[0],
      address: subscription.user.address || 'N/A',
      revenue: subscription.revenue.toString(),
      email: subscription.email || subscription.user.email,
      phone: subscription.phone || subscription.user.phone || 'N/A',
      status: subscription.status
    }));

    return NextResponse.json({ 
      subscriptions: transformedSubscriptions 
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

// PUT - Update subscription
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      clientName,
      planName,
      startDate,
      expiryDate,
      address,
      revenue,
      email,
      phone,
      status
    } = body;

    // Validate required fields
    if (!id || !clientName || !planName || !startDate || !expiryDate || !revenue) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if subscription exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id },
      data: {
        planName,
        startDate: new Date(startDate),
        expiryDate: new Date(expiryDate),
        revenue: parseFloat(revenue),
        email,
        phone,
        status
      }
    });

    // Update user information if provided
    if (address || email || phone) {
      await prisma.user.update({
        where: { id: existingSubscription.userId },
        data: {
          ...(address && { address }),
          ...(email && { email }),
          ...(phone && { phone })
        }
      });
    }

    return NextResponse.json({ 
      message: 'Subscription updated successfully',
      subscription: updatedSubscription
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

// DELETE - Delete subscription
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Check if subscription exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id }
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Delete subscription
    await prisma.subscription.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: 'Subscription deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscription' },
      { status: 500 }
    );
  }
}

// POST - Create new subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      planName,
      startDate,
      expiryDate,
      revenue,
      email,
      phone,
      status = 'active'
    } = body;

    // Validate required fields
    if (!userId || !planName || !startDate || !expiryDate || !revenue) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create subscription
    const newSubscription = await prisma.subscription.create({
      data: {
        userId,
        planName,
        startDate: new Date(startDate),
        expiryDate: new Date(expiryDate),
        revenue: parseFloat(revenue),
        email,
        phone,
        status
      }
    });

    return NextResponse.json({ 
      message: 'Subscription created successfully',
      subscription: newSubscription
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}