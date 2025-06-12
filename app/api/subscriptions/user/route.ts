import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
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

    // Get the user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: dbUser.id,
        status: 'active'
      }
    });

    if (!subscription) {
      return NextResponse.json(
        { subscription: null },
        { status: 200 }
      );
    }

    // Transform the subscription data to match the expected format in the frontend
    const transformedSubscription = {
      id: subscription.id,
      planName: subscription.planName,
      planType: subscription.planName.includes('Residential') ? 'residential' : 'industrial',
      price: subscription.revenue.toString(),
      startDate: subscription.startDate.toISOString(),
      endDate: subscription.expiryDate.toISOString(),
      status: subscription.status,
      features: getFeaturesByPlanName(subscription.planName)
    };

    return NextResponse.json(
      { subscription: transformedSubscription },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get features based on plan name
function getFeaturesByPlanName(planName: string): string[] {
  // Basic features for all plans
  const baseFeatures = [
    'Weekly cleaning service',
    'Professional cleaning staff',
    'Satisfaction guarantee'
  ];

  if (planName.includes('Premium')) {
    return [
      ...baseFeatures,
      'Priority scheduling',
      'Deep cleaning included',
      'Weekend availability'
    ];
  } else if (planName.includes('Business')) {
    return [
      ...baseFeatures,
      'Multiple location support',
      'Customized cleaning schedule',
      'Dedicated account manager',
      'Commercial-grade cleaning'
    ];
  } else {
    // Standard plan
    return baseFeatures;
  }
}