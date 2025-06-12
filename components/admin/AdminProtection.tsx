'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

interface AdminProtectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface AdminVerificationState {
  isLoading: boolean
  isAdmin: boolean
  error: string | null
}

/**
 * Component to protect admin routes and components
 * Redirects non-admin users to sign-in page
 */
export default function AdminProtection({ children, fallback }: AdminProtectionProps) {
  const { user, session, loading } = useAuth()
  const router = useRouter()
  const [adminState, setAdminState] = useState<AdminVerificationState>({
    isLoading: true,
    isAdmin: false,
    error: null
  })

  useEffect(() => {
    const verifyAdminAccess = async () => {
      // Wait for auth context to load
      if (loading) return

      // If no user or session, redirect to sign-in
      if (!user || !session) {
        router.push('/signin?redirect=/admin')
        return
      }

      try {
        // Verify admin access with the server
        const response = await fetch('/api/auth/admin/verify', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        })

        if (response.ok) {
          setAdminState({
            isLoading: false,
            isAdmin: true,
            error: null
          })
        } else {
          const errorData = await response.json()
          setAdminState({
            isLoading: false,
            isAdmin: false,
            error: errorData.error || 'Access denied'
          })
          
          // Redirect to home page with error message
          router.push('/?error=access-denied')
        }
      } catch (error) {
        console.error('Admin verification error:', error)
        setAdminState({
          isLoading: false,
          isAdmin: false,
          error: 'Failed to verify admin access'
        })
        router.push('/?error=verification-failed')
      }
    }

    verifyAdminAccess()
  }, [user, session, loading, router])

  // Show loading state
  if (loading || adminState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (adminState.error && !adminState.isAdmin) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong className="font-bold">Access Denied!</strong>
              <span className="block sm:inline"> {adminState.error}</span>
            </div>
            <p className="text-gray-600 mb-4">
              You need administrator privileges to access this page.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Home
            </button>
          </div>
        </div>
      )
    )
  }

  // Show admin content if user is verified admin
  if (adminState.isAdmin) {
    return <>{children}</>
  }

  // Default fallback
  return null
}

/**
 * Higher-order component for admin protection
 */
export function withAdminProtection<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AdminProtectedComponent(props: P) {
    return (
      <AdminProtection>
        <Component {...props} />
      </AdminProtection>
    )
  }
}