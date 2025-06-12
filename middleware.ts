import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware to protect admin routes
 * This runs before the request reaches the API routes or pages
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the request is for admin routes
  if (pathname.startsWith('/admin')) {
    // For admin pages, let the AdminProtection component handle the auth
    // This middleware just ensures the route exists
    return NextResponse.next()
  }
  
  // Check if the request is for admin API routes (except auth endpoints)
  if (pathname.startsWith('/api/admin') || 
      (pathname.startsWith('/api/') && 
       pathname.includes('/admin/') && 
       !pathname.includes('/api/auth/admin'))) {
    
    // For admin API routes, we'll let the individual route handlers
    // use the requireAdminAuth function for proper authentication
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

/**
 * Configure which routes this middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}