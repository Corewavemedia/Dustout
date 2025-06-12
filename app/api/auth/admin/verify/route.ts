import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/admin-auth'

/**
 * API route to verify admin access
 * Used by client-side components to check if user has admin privileges
 */
export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth(request)
  
  // If authResult is a NextResponse (error), return it
  if (authResult instanceof NextResponse) {
    return authResult
  }
  
  // If successful, return user data
  return NextResponse.json({
    success: true,
    user: authResult.user
  })
}