import { NextRequest, NextResponse } from 'next/server'
import { createAdminUser } from '@/lib/admin-auth'
import { z } from 'zod'

// Validation schema for admin user creation
const createAdminSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  adminKey: z.string().min(1, 'Admin key is required')
})

/**
 * API route to create admin users
 * Requires a special admin key for security
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createAdminSchema.parse(body)
    
    // Check admin key (you should set this in your environment variables)
    const expectedAdminKey = process.env.ADMIN_CREATION_KEY
    if (!expectedAdminKey || validatedData.adminKey !== expectedAdminKey) {
      return NextResponse.json(
        { error: 'Invalid admin key' },
        { status: 403 }
      )
    }
    
    // Create admin user
    const result = await createAdminUser(
      validatedData.email,
      validatedData.username,
      validatedData.password
    )
    
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: result.user
    })
    
  } catch (error) {
    console.error('Create admin API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}