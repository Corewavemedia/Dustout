'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { AuthService, AuthUser } from './auth'
import type { Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  token: string | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string; success?: boolean }>
  signUp: (username: string, email: string, password: string) => Promise<{ error?: string; success?: boolean }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      
      if (session?.user) {
        try {
          // Fetch user data with access token
          if (session?.access_token) {
            const response = await fetch('/api/auth/user', {
              headers: {
                'Authorization': `Bearer ${session.access_token}`
              }
            })
            const userData = await response.json()
            
            if (response.ok && userData.user) {
              setUser(userData.user)
            } else {
              setUser(null)
            }
          } else {
            setUser(null)
          }
        } catch (error) {
          console.error('Failed to get user:', error)
        }
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        
        if (session?.user) {
          try {
            // Fetch user data with access token
            if (session?.access_token) {
              const response = await fetch('/api/auth/user', {
                headers: {
                  'Authorization': `Bearer ${session.access_token}`
                }
              })
              const userData = await response.json()
              
              if (response.ok && userData.user) {
                setUser(userData.user)
              } else {
                setUser(null)
              }
            } else {
              setUser(null)
            }
          } catch (error) {
            console.error('Failed to get user:', error)
          }
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setLoading(false)
        return { error: data.error || 'Sign in failed' }
      }
      
      // Tell Supabase client about the new session
      // This will trigger the onAuthStateChange listener correctly
      if (data.session) {
        await supabase.auth.setSession(data.session)
      }
      
      setLoading(false)
      return { success: true }
    } catch (error) {
      console.error('Signin error:', error)
      setLoading(false)
      return { error: 'Sign in failed' }
    }
  }

  const signUp = async (username: string, email: string, password: string) => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setLoading(false)
        return { error: data.error || 'Registration failed' }
      }
      
      // Tell Supabase client about the new session
      // This will trigger the onAuthStateChange listener correctly
      if (data.session) {
        await supabase.auth.setSession(data.session)
      }
      
      setLoading(false)
      return { success: true }
    } catch (error) {
      console.error('Signup error:', error)
      setLoading(false)
      return { error: 'Registration failed' }
    }
  }

  const signOut = async () => {
    setLoading(true)
    await AuthService.signOut()
    setUser(null)
    setSession(null)
    setLoading(false)
  }

  const refreshUser = async () => {
    try {
      // Get the current session to include the access token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        setUser(null)
        return
      }
      
      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      const data = await response.json()
      
      if (response.ok && data.user) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
    }
  }

  const value = {
    user,
    session,
    token: session?.access_token || null,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}