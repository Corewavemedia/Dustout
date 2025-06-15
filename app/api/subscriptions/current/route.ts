import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verify the user with Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Find the user in our database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Find all user's subscriptions
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: dbUser.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Categorize subscriptions
    const activeSubscription = subscriptions.find(sub => sub.status === 'active');
    const cancellingSubscription = subscriptions.find(sub => sub.status === 'cancelling');
    const cancelledSubscriptions = subscriptions.filter(sub => sub.status === 'cancelled');
    const pendingSubscriptions = subscriptions.filter(sub => sub.status === 'pending');

    const formatSubscription = (subscription: any) => ({
      id: subscription.id,
      planName: subscription.planName,
      planType: subscription.planType,
      revenue: subscription.revenue,
      status: subscription.status,
      startDate: subscription.startDate.toISOString(),
      expiryDate: subscription.expiryDate.toISOString(),
      currentPeriodStart: subscription.currentPeriodStart?.toISOString(),
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString(),
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      cancelledAt: subscription.cancelledAt?.toISOString(),
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      createdAt: subscription.createdAt.toISOString()
    });

    return NextResponse.json({
      activeSubscription: activeSubscription ? formatSubscription(activeSubscription) : null,
      cancellingSubscription: cancellingSubscription ? formatSubscription(cancellingSubscription) : null,
      cancelledSubscriptions: cancelledSubscriptions.map(formatSubscription),
      pendingSubscriptions: pendingSubscriptions.map(formatSubscription),
      // For backward compatibility
      subscription: activeSubscription || cancellingSubscription || cancelledSubscriptions[0] || null
    });

  } catch (error) {
    console.error('Get current subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve subscription' },
      { status: 500 }
    );
  }
}