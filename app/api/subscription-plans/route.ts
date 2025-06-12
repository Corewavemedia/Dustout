import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Fetch all subscription plans
export async function GET() {
  try {
    const subscriptionPlans = await prisma.subscriptionPlan.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(subscriptionPlans);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription plans' },
      { status: 500 }
    );
  }
}

// POST - Create a new subscription plan
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser || dbUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, type, price, features } = body;

    // Validate required fields
    if (!name || !type || !price || !features) {
      return NextResponse.json(
        { error: 'Name, type, price, and features are required' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['residential', 'industrial'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either "residential" or "industrial"' },
        { status: 400 }
      );
    }

    // Validate price
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    // Validate features
    if (!Array.isArray(features) || features.length === 0) {
      return NextResponse.json(
        { error: 'Features must be a non-empty array' },
        { status: 400 }
      );
    }

    const subscriptionPlan = await prisma.subscriptionPlan.create({
      data: {
        name: name.trim(),
        type,
        price,
        features: features.filter(f => f.trim()).map(f => f.trim())
      }
    });

    return NextResponse.json(subscriptionPlan, { status: 201 });
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription plan' },
      { status: 500 }
    );
  }
}

// PUT - Update a subscription plan
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser || dbUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, name, type, price, features } = body;

    // Validate required fields
    if (!id || !name || !type || !price || !features) {
      return NextResponse.json(
        { error: 'ID, name, type, price, and features are required' },
        { status: 400 }
      );
    }

    // Validate type
    if (!['residential', 'industrial'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either "residential" or "industrial"' },
        { status: 400 }
      );
    }

    // Validate price
    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Price must be a positive number' },
        { status: 400 }
      );
    }

    // Validate features
    if (!Array.isArray(features) || features.length === 0) {
      return NextResponse.json(
        { error: 'Features must be a non-empty array' },
        { status: 400 }
      );
    }

    const subscriptionPlan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        name: name.trim(),
        type,
        price,
        features: features.filter(f => f.trim()).map(f => f.trim())
      }
    });

    return NextResponse.json(subscriptionPlan);
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription plan' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a subscription plan
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser || dbUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Subscription plan ID is required' },
        { status: 400 }
      );
    }

    // Check if subscription plan exists
    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: { id }
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: 'Subscription plan not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    const subscriptionPlan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        isActive: false
      }
    });

    return NextResponse.json({ message: 'Subscription plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscription plan' },
      { status: 500 }
    );
  }
}