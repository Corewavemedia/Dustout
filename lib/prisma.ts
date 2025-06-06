import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper function to handle Prisma errors
export const handlePrismaError = (error: unknown) => {
  console.error('Prisma error:', error)
  
  if (error && typeof error === 'object' && 'code' in error) {
    if (error.code === 'P2002') {
      return { error: 'A record with this information already exists' }
    }
    
    if (error.code === 'P2025') {
      return { error: 'Record not found' }
    }
  }
  
  return { error: 'Database operation failed' }
}