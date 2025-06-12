# Admin Authentication System

This document describes the role-based authentication system implemented for the DustOut admin panel.

## Overview

The admin authentication system provides secure, role-based access control with the following features:

- **Role-based Authentication**: Users can have either `user` or `admin` roles
- **Route Protection**: Admin routes are automatically protected
- **API Security**: Admin API endpoints require proper authentication
- **User Management**: Admins can promote/demote other users
- **Secure Setup**: Initial admin creation with proper validation

## Architecture

### Database Schema

The `User` model has been extended with a `role` field:

```prisma
model User {
  id                String   @id @default(uuid())
  username          String   @unique
  email             String   @unique
  created_at        DateTime @default(now())
  is_verified       Boolean  @default(true)
  verification_token String?
  role              String   @default("user") // "user" or "admin"
  // ... other fields
}
```

### Key Components

1. **AdminProtection Component** (`/components/admin/AdminProtection.tsx`)
   - Wraps admin pages and components
   - Verifies user authentication and admin role
   - Redirects unauthorized users

2. **Admin Auth Utilities** (`/lib/admin-auth.ts`)
   - `requireAdminAuth()`: Middleware for API route protection
   - `useAdminAuth()`: Client-side hook for admin verification
   - `createAdminUser()`: Utility for creating admin users

3. **API Routes**
   - `/api/auth/admin/verify`: Verify admin access
   - `/api/auth/admin/create`: Create new admin users
   - `/api/auth/admin/promote`: Promote/demote users

## Setup Instructions

### 1. Database Migration

After updating the schema, run the Prisma migration:

```bash
npx prisma migrate dev --name add-user-roles
npx prisma generate
```

### 2. Environment Variables

Add the following environment variables to your `.env.local`:

```env
# Required for admin user creation
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Key for creating admin users via API
ADMIN_CREATION_KEY=your_secure_admin_creation_key
```

### 3. Create First Admin User

Run the setup script to create your first admin user:

```bash
node scripts/create-admin.js
```

Follow the prompts to enter:
- Admin email
- Admin username
- Admin password (minimum 8 characters)

### 4. Verify Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/admin` - you should be redirected to sign-in
3. Sign in with your admin credentials
4. You should now have access to the admin panel

## Usage

### Protecting Admin Routes

Admin routes are automatically protected by the `AdminProtection` component in the admin layout:

```tsx
// app/admin/layout.tsx
import AdminProtection from '@/components/admin/AdminProtection'

export default function AdminLayout({ children }) {
  return (
    <AdminProtection>
      <div className="min-h-screen bg-bg-light">
        {children}
      </div>
    </AdminProtection>
  )
}
```

### Protecting API Routes

Use the `requireAdminAuth` function in your API routes:

```tsx
// app/api/admin/some-endpoint/route.ts
import { requireAdminAuth } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const authResult = await requireAdminAuth(request)
  
  if (authResult instanceof NextResponse) {
    return authResult // Return error response
  }
  
  // Continue with admin-only logic
  const adminUser = authResult.user
  // ...
}
```

### Managing User Roles

#### Via Admin Panel

1. Navigate to the admin panel
2. Go to User Management section
3. Use the "Promote to Admin" or "Demote" buttons

#### Via API

```javascript
// Promote user to admin
fetch('/api/auth/admin/promote', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    userId: 'user-uuid',
    action: 'promote'
  })
})

// Demote admin to user
fetch('/api/auth/admin/promote', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    userId: 'user-uuid',
    action: 'demote'
  })
})
```

### Creating Additional Admin Users

#### Method 1: Using the Script

```bash
node scripts/create-admin.js
```

#### Method 2: Using the API (if ADMIN_CREATION_KEY is set)

```javascript
fetch('/api/auth/admin/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    username: 'adminuser',
    password: 'securepassword',
    adminKey: process.env.ADMIN_CREATION_KEY
  })
})
```

## Security Features

### Authentication Flow

1. **Client Request**: User attempts to access admin route
2. **Token Verification**: Supabase JWT token is verified
3. **Database Check**: User role is checked in the database
4. **Authorization**: Access granted only if role is 'admin'

### Protection Mechanisms

- **JWT Token Validation**: All requests verified with Supabase
- **Role-based Access Control**: Database-level role checking
- **Route Protection**: Client-side and server-side validation
- **Self-Protection**: Admins cannot demote themselves
- **Secure Admin Creation**: Requires special key or script access

### Best Practices

1. **Environment Security**: Keep service role keys secure
2. **Regular Audits**: Monitor admin user list regularly
3. **Principle of Least Privilege**: Only grant admin access when necessary
4. **Secure Passwords**: Enforce strong password requirements
5. **Session Management**: Leverage Supabase's secure session handling

## API Reference

### GET `/api/auth/admin/verify`

Verify if the current user has admin access.

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### POST `/api/auth/admin/create`

Create a new admin user (requires ADMIN_CREATION_KEY).

**Body:**
```json
{
  "email": "admin@example.com",
  "username": "adminuser",
  "password": "securepassword",
  "adminKey": "your_admin_creation_key"
}
```

### POST `/api/auth/admin/promote`

Promote or demote a user (admin only).

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Body:**
```json
{
  "userId": "user-uuid",
  "action": "promote" // or "demote"
}
```

### GET `/api/auth/admin/promote`

Get all users (admin only).

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "username": "user1",
      "email": "user1@example.com",
      "role": "user",
      "created_at": "2024-01-01T00:00:00Z",
      "is_verified": true
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **"Access Denied" Error**
   - Verify user has admin role in database
   - Check JWT token is valid
   - Ensure proper Authorization header

2. **Cannot Create Admin User**
   - Verify Supabase service role key is set
   - Check database connection
   - Ensure email/username is unique

3. **Redirect Loop**
   - Clear browser cache and cookies
   - Check auth context is properly initialized
   - Verify Supabase configuration

### Debug Mode

Enable debug logging by setting:

```env
NEXT_PUBLIC_DEBUG_AUTH=true
```

This will log authentication steps to the browser console.

## Migration Guide

If you're adding this to an existing system:

1. **Backup your database** before running migrations
2. **Run the Prisma migration** to add the role field
3. **Update existing users** to have appropriate roles:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your-admin@example.com';
   ```
4. **Test the system** with a non-admin user first
5. **Create additional admin users** as needed

## Support

For issues or questions about the admin authentication system:

1. Check the troubleshooting section above
2. Review the API responses for error details
3. Check browser console for client-side errors
4. Verify environment variables are properly set