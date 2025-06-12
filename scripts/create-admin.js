/**
 * Script to create the first admin user
 * Run this script to bootstrap your admin system
 * 
 * Usage: node scripts/create-admin.js
 */

const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')
const readline = require('readline')

const prisma = new PrismaClient()

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Promisify readline question
const question = (query) => new Promise((resolve) => rl.question(query, resolve))

async function createAdminUser() {
  try {
    console.log('🚀 Admin User Creation Script')
    console.log('================================\n')
    
    // Check if Supabase credentials are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing Supabase environment variables:')
      console.error('   - NEXT_PUBLIC_SUPABASE_URL')
      console.error('   - SUPABASE_SERVICE_ROLE_KEY')
      process.exit(1)
    }
    
    // Get user input
    const email = await question('Enter admin email: ')
    const username = await question('Enter admin username: ')
    const password = await question('Enter admin password (min 8 characters): ')
    
    // Validate input
    if (!email || !email.includes('@')) {
      console.error('❌ Invalid email address')
      process.exit(1)
    }
    
    if (!username || username.length < 3) {
      console.error('❌ Username must be at least 3 characters')
      process.exit(1)
    }
    
    if (!password || password.length < 8) {
      console.error('❌ Password must be at least 8 characters')
      process.exit(1)
    }
    
    console.log('\n🔄 Creating admin user...')
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    })
    
    if (existingUser) {
      console.error('❌ User with this email or username already exists')
      process.exit(1)
    }
    
    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
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
      console.error('❌ Failed to create user in Supabase:', authError?.message)
      process.exit(1)
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
    
    console.log('\n✅ Admin user created successfully!')
    console.log('================================')
    console.log(`👤 Username: ${user.username}`)
    console.log(`📧 Email: ${user.email}`)
    console.log(`🔑 Role: ${user.role}`)
    console.log(`🆔 ID: ${user.id}`)
    console.log('\n🎉 You can now sign in to the admin panel!')
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
    rl.close()
  }
}

// Handle script interruption
process.on('SIGINT', async () => {
  console.log('\n\n👋 Script interrupted')
  await prisma.$disconnect()
  rl.close()
  process.exit(0)
})

// Run the script
createAdminUser()