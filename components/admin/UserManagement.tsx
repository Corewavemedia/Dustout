'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'

interface User {
  id: string
  username: string
  email: string
  role: string
  created_at: string
  is_verified: boolean
  fullname?: string
}

interface UserManagementState {
  users: User[]
  loading: boolean
  error: string | null
  actionLoading: string | null // ID of user being processed
}

export default function UserManagement() {
  const { session } = useAuth()
  const [state, setState] = useState<UserManagementState>({
    users: [],
    loading: true,
    error: null,
    actionLoading: null
  })

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    if (!session?.access_token) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await fetch('/api/auth/admin/promote', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setState(prev => ({
        ...prev,
        users: data.users,
        loading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
        loading: false
      }))
    }
  }, [session?.access_token])

  // Promote or demote user
  const handleRoleChange = async (userId: string, action: 'promote' | 'demote') => {
    if (!session?.access_token) return

    try {
      setState(prev => ({ ...prev, actionLoading: userId }))
      
      const response = await fetch('/api/auth/admin/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ userId, action })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update user role')
      }

      // Refresh users list
      await fetchUsers()
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update user role'
      }))
    } finally {
      setState(prev => ({ ...prev, actionLoading: null }))
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  if (state.loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-6 md:px-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#538FDF] font-majer mb-2">Settings</h1>
        <p className="text-gray-600">Manage user roles and permissions</p>
      </div>

      {state.error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span>{state.error}</span>
          <button
            onClick={() => setState(prev => ({ ...prev, error: null }))}
            className="float-right text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-lg font-normal text-[#538FDF] font-majer">All Users ({state.users.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#538FDF] text-white font-majer">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-[#538FDF] font-majer">
                        {user.fullname || user.username}
                      </div>
                     
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#538FDF] font-majer">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_verified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.is_verified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#538FDF] font-majer">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.role === 'admin' ? (
                      <button
                        onClick={() => handleRoleChange(user.id, 'demote')}
                        disabled={state.actionLoading === user.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {state.actionLoading === user.id ? 'Processing...' : 'Demote'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRoleChange(user.id, 'promote')}
                        disabled={state.actionLoading === user.id}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {state.actionLoading === user.id ? 'Processing...' : 'Promote to Admin'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {state.users.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Security Notes:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Admin users have full access to the admin panel and all management features</li>
          <li>• Regular users can only access their own bookings and profile</li>
          <li>• You cannot demote yourself to prevent lockout</li>
          <li>• Role changes take effect immediately</li>
        </ul>
      </div>
    </div>
  )
}