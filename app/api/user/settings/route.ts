import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';

const supabase = createServerClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil'
});

// GET endpoint to retrieve user settings and payment information
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
      where: { email: user.email! },
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        address: true,
        phone: true,
        created_at: true
      }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Get payment method information if user has an active subscription
    let paymentMethod = null;
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: dbUser.id,
        status: 'active'
      }
    });

    if (subscription?.stripeCustomerId) {
      try {
        const customer = await stripe.customers.retrieve(subscription.stripeCustomerId) as Stripe.Customer;
        
        if (customer.invoice_settings?.default_payment_method) {
          const pm = await stripe.paymentMethods.retrieve(
            customer.invoice_settings.default_payment_method as string
          );

          paymentMethod = {
            id: pm.id,
            type: pm.type,
            card: pm.card ? {
              brand: pm.card.brand,
              last4: pm.card.last4,
              exp_month: pm.card.exp_month,
              exp_year: pm.card.exp_year
            } : null
          };
        }
      } catch (stripeError) {
        console.error('Error fetching payment method:', stripeError);
        // Continue without payment method info
      }
    }

    return NextResponse.json({
      user: dbUser,
      paymentMethod,
      hasActiveSubscription: !!subscription
    });

  } catch (error) {
    console.error('Get user settings error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user settings' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update user settings
export async function PUT(request: NextRequest) {
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

    const { updateType, ...updateData } = await request.json();

    switch (updateType) {
      case 'username':
        return await updateUsername(dbUser.id, updateData.username);
      
      case 'password':
        return await updatePassword(token, updateData.currentPassword, updateData.newPassword);
      
      case 'profile':
        return await updateProfile(dbUser.id, updateData);
      
      default:
        return NextResponse.json(
          { error: 'Invalid update type' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Update user settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update user settings' },
      { status: 500 }
    );
  }
}

// POST endpoint to create setup intent for payment method updates
export async function POST(request: NextRequest) {
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

    // Find or create Stripe customer
    let stripeCustomerId;
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: dbUser.id,
        status: 'active'
      }
    });

    if (subscription?.stripeCustomerId) {
      stripeCustomerId = subscription.stripeCustomerId;
    } else {
      // Create new Stripe customer if none exists
      const customer = await stripe.customers.create({
        email: dbUser.email,
        name: dbUser.fullname || dbUser.username,
        metadata: {
          userId: dbUser.id
        }
      });
      stripeCustomerId = customer.id;
    }

    // Create a Stripe setup session for payment method
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'setup',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings?payment_method=updated`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings?payment_method=cancelled`,
      metadata: {
        userId: dbUser.id,
        purpose: 'payment_method_setup'
      }
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Create setup intent error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment method setup session' },
      { status: 500 }
    );
  }
}

// Helper function to update username
async function updateUsername(userId: string, newUsername: string) {
  if (!newUsername || newUsername.trim().length < 3) {
    return NextResponse.json(
      { error: 'Username must be at least 3 characters long' },
      { status: 400 }
    );
  }

  // Check if username is already taken
  const existingUser = await prisma.user.findUnique({
    where: { username: newUsername.trim() }
  });

  if (existingUser && existingUser.id !== userId) {
    return NextResponse.json(
      { error: 'Username is already taken' },
      { status: 409 }
    );
  }

  // Update username
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { username: newUsername.trim() },
    select: {
      id: true,
      username: true,
      email: true,
      fullname: true,
      address: true,
      phone: true
    }
  });

  return NextResponse.json({
    message: 'Username updated successfully',
    user: updatedUser
  });
}

// Helper function to update password
async function updatePassword(token: string, currentPassword: string, newPassword: string) {
  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: 'Current password and new password are required' },
      { status: 400 }
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: 'New password must be at least 6 characters long' },
      { status: 400 }
    );
  }

  try {
    // Get the current user to obtain their ID and email
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);
    
    if (getUserError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    });

    if (signInError) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Update password using Supabase Admin API
    const { error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update password: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Password update error:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}

// Helper function to update profile information
async function updateProfile(userId: string, profileData: any) {
  const allowedFields = ['fullname', 'address', 'phone'];
  const updateData: any = {};

  // Filter only allowed fields
  for (const field of allowedFields) {
    if (profileData[field] !== undefined) {
      updateData[field] = profileData[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    );
  }

  // Update profile
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      username: true,
      email: true,
      fullname: true,
      address: true,
      phone: true
    }
  });

  return NextResponse.json({
    message: 'Profile updated successfully',
    user: updatedUser
  });
}