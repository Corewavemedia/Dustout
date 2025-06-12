import { supabase } from './supabase'
import { prisma, handlePrismaError } from './prisma'
import { z } from 'zod'

// Validation schemas
export const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export interface AuthUser {
  id: string
  username: string
  email: string
  created_at: Date
  is_verified: boolean
  role: string
  fullname?: string | null
  address?: string | null
  phone?: string | null
}

export class AuthService {
  // Sign up new user
  static async signUp(data: z.infer<typeof signUpSchema>) {
    try {
      // Validate input
      const validatedData = signUpSchema.parse(data)
      
      // Check if username already exists in our database
      const existingUser = await prisma.user.findUnique({
        where: { username: validatedData.username }
      })
      
      if (existingUser) {
        return { error: 'Username already exists' }
      }
      
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            username: validatedData.username
          }
        }
      })
      
      if (authError) {
        return { error: authError.message }
      }
      
      if (!authData.user) {
        return { error: 'Failed to create user account' }
      }
      
      // Create user record in our database
      try {
        const user = await prisma.user.create({
          data: {
            id: authData.user.id,
            username: validatedData.username,
            email: validatedData.email,
            is_verified: authData.user.email_confirmed_at ? true : false
          }
        })
        
        return { 
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            created_at: user.created_at,
            is_verified: user.is_verified,
            role: user.role,
            fullname: user.fullname,
            address: user.address,
            phone: user.phone
          },
          session: authData.session
        }
      } catch (prismaError) {
        // If Prisma fails, clean up Supabase user
        console.error('Prisma error during user creation:', prismaError)
        await supabase.auth.admin.deleteUser(authData.user.id)
        return handlePrismaError(prismaError)
      }
      
    } catch (error) {
      console.error('Registration error:', error)
      if (error instanceof z.ZodError) {
        return { error: error.errors[0].message }
      }
      return { error: 'Registration failed' }
    }
  }
  
  // Sign in user
  static async signIn(data: z.infer<typeof signInSchema>) {
    try {
      // Validate input
      const validatedData = signInSchema.parse(data)
      
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password
      })
      
      if (authError) {
        return { error: authError.message }
      }
      
      if (!authData.user || !authData.session) {
        return { error: 'Invalid credentials' }
      }
      
      // Get user data from our database
      const user = await prisma.user.findUnique({
        where: { id: authData.user.id }
      })
      
      if (!user) {
        return { error: 'User not found in database' }
      }
      
      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at,
          is_verified: user.is_verified,
          role: user.role,
          fullname: user.fullname,
          address: user.address,
          phone: user.phone
        },
        session: authData.session
      }
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { error: error.errors[0].message }
      }
      return { error: 'Sign in failed' }
    }
  }
  
  // Sign out user
  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      return { error: error.message }
    }
    return { success: true }
  }
  
  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        return { error: 'Not authenticated' }
      }
      
      // Get user data from our database
      const userData = await prisma.user.findUnique({
        where: { id: user.id }
      })
      
      if (!userData) {
        return { error: 'User not found in database' }
      }
      
      return {
        user: {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          created_at: userData.created_at,
          is_verified: userData.is_verified,
          role: userData.role,
          fullname: userData.fullname,
          address: userData.address,
          phone: userData.phone
        }
      }
      
    } catch {
      return { error: 'Failed to get current user' }
    }
  }
  
  // Update user profile
  static async updateProfile(userId: string, data: Partial<Pick<AuthUser, 'fullname' | 'address' | 'phone'>>) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          fullname: data.fullname,
          address: data.address,
          phone: data.phone
        }
      })
      
      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at,
          is_verified: user.is_verified,
          role: user.role,
          fullname: user.fullname,
          address: user.address,
          phone: user.phone
        }
      }
      
    } catch (error) {
      return handlePrismaError(error)
    }
  }
}