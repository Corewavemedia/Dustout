import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { prisma } from './prisma'

/**
 * Middleware to protect admin routes
 * Verifies that the user is authenticated and has admin role
 */
export async function requireAdminAuth(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    // Create Supabase client and verify the token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user data from our database to check role
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        is_verified: true
      }
    })

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    // Check if user has admin role
    if (userData.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admin privileges required.' },
        { status: 403 }
      )
    }

    // Return user data if authentication and authorization successful
    return {
      success: true,
      user: userData
    }

  } catch (error) {
    console.error('Admin auth middleware error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Client-side hook to check if current user is admin
 */
export function useAdminAuth() {
  const checkAdminAccess = async (token: string) => {
    try {
      const response = await fetch('/api/auth/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        return { isAdmin: false, error: 'Access denied' }
      }
      
      const data = await response.json()
      return { isAdmin: true, user: data.user }
    } catch (error) {
      return { isAdmin: false, error: 'Failed to verify admin access' }
    }
  }

  return { checkAdminAccess }
}

/**
 * Utility function to create an admin user (for initial setup)
 */
export async function createAdminUser(email: string, username: string, password: string) {
  try {
    // Create Supabase client with service role key for admin operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username
      }
    })

    if (authError || !authData.user) {
      return { error: authError?.message || 'Failed to create admin user' }
    }

    // Create user record in database with admin role
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        username,
        email,
        role: 'admin',
        is_verified: true
      }
    })

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }

  } catch (error) {
    console.error('Error creating admin user:', error)
    return { error: 'Failed to create admin user' }
  }
}