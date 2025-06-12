import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for promoting user to admin
const promoteUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  action: z.enum(['promote', 'demote'])
})

/**
 * API route to promote/demote users to/from admin role
 * Only accessible by existing admins
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await requireAdminAuth(request)
    
    // If authResult is a NextResponse (error), return it
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    const body = await request.json()
    
    // Validate input
    const validatedData = promoteUserSchema.parse(body)
    
    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true
      }
    })
    
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Prevent self-demotion
    if (validatedData.action === 'demote' && targetUser.id === authResult.user.id) {
      return NextResponse.json(
        { error: 'Cannot demote yourself' },
        { status: 400 }
      )
    }
    
    // Update user role
    const newRole = validatedData.action === 'promote' ? 'admin' : 'user'
    
    // Check if action is necessary
    if (targetUser.role === newRole) {
      return NextResponse.json(
        { error: `User is already ${newRole === 'admin' ? 'an admin' : 'a regular user'}` },
        { status: 400 }
      )
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: validatedData.userId },
      data: { role: newRole },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true
      }
    })
    
    return NextResponse.json({
      success: true,
      message: `User ${validatedData.action === 'promote' ? 'promoted to admin' : 'demoted to user'} successfully`,
      user: updatedUser
    })
    
  } catch (error) {
    console.error('Promote user API error:', error)
    
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

/**
 * API route to get all users (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await requireAdminAuth(request)
    
    // If authResult is a NextResponse (error), return it
    if (authResult instanceof NextResponse) {
      return authResult
    }
    
    // Get all users with basic info
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
        is_verified: true,
        fullname: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })
    
    return NextResponse.json({
      success: true,
      users
    })
    
  } catch (error) {
    console.error('Get users API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}