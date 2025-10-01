# Google Authentication with JWT Implementation

This document outlines the implementation of Google OAuth authentication with JWT tokens for the Dresscode application.

## Overview

The authentication system now uses:

- **NextAuth.js** for OAuth flow management
- **Google OAuth 2.0** for user authentication
- **JWT tokens** for session management and API authentication
- **MongoDB** for user data storage

## Key Features

### 1. Google OAuth Integration

- Users can sign in with their Google accounts
- Automatic user profile creation and linking
- Support for existing users (email-based account linking)

### 2. JWT Token Management

- Secure JWT token generation and verification
- 30-day token expiration
- Token storage in localStorage for client-side access
- Server-side token verification API endpoint

### 3. User Session Management

- NextAuth session handling
- Automatic JWT token generation on successful authentication
- User data persistence in localStorage for compatibility
- Secure logout with token cleanup

## Implementation Details

### Files Modified/Created

#### 1. Authentication Configuration (`src/app/_lib/auth.ts`)

- Updated NextAuth configuration to use JWT strategy
- Implemented Google OAuth provider
- Added JWT and session callbacks for user data management
- Automatic user creation/linking from Google profiles

#### 2. JWT Utilities (`src/app/_lib/jwt.ts`)

- JWT token generation and verification functions
- Token expiration checking
- Type-safe JWT payload interface

#### 3. Action Utilities (`src/app/_lib/action.ts`)

- Enhanced with JWT token management functions
- Token storage and retrieval utilities
- Secure logout with token cleanup

#### 4. Login Page (`src/app/login/page.tsx`)

- Updated to use NextAuth session management
- Automatic JWT token generation on successful authentication
- Improved user experience with session persistence

#### 5. User Dropdown (`src/app/_components/UserDropdown.tsx`)

- Integrated with NextAuth session
- Displays user profile image from Google
- Secure logout functionality

#### 6. API Endpoints

- **`/api/auth/verify`** - JWT token verification endpoint
- **`/api/auth/[...nextauth]`** - NextAuth API routes

### Database Schema

The user model supports:

- Google OAuth integration (`googleId`, `provider`)
- User profile data (`firstName`, `lastName`, `image`)
- Role-based access control (`role`)
- Account verification status (`verified`)

## Environment Variables Required

Create a `.env.local` file with:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/dresscode

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# API Base URL
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 Client IDs
5. Set authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy credentials to `.env.local`

## Usage

### Client-Side Authentication

```typescript
import { useSession, signIn, signOut } from "next-auth/react";
import { storeJWTToken, getStoredJWTToken } from "@/app/_lib/action";

// Check authentication status
const { data: session, status } = useSession();

// Sign in with Google
await signIn("google", { callbackUrl: "/" });

// Sign out
await signOut({ callbackUrl: "/" });

// Get stored JWT token
const token = getStoredJWTToken();
```

### Server-Side Token Verification

```typescript
import { verifyJWT } from "@/app/_lib/jwt";

// Verify JWT token
const payload = verifyJWT(token);
if (payload) {
  // Token is valid, use payload data
  console.log("User ID:", payload.id);
  console.log("User Role:", payload.role);
}
```

### API Authentication

```typescript
// Verify token in API routes
const response = await fetch("/api/auth/verify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ token: jwtToken }),
});

const { user, valid } = await response.json();
```

## Security Features

1. **JWT Token Security**
   - Signed with NEXTAUTH_SECRET
   - 30-day expiration
   - Issuer validation

2. **User Data Protection**
   - Sensitive data excluded from JWT payload
   - Database verification for critical operations
   - Secure token storage

3. **Session Management**
   - Automatic token refresh
   - Secure logout with cleanup
   - Cross-tab session synchronization

## Testing the Implementation

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Navigate to login page:**

   ```
   http://localhost:3000/login
   ```

3. **Test Google authentication:**
   - Click "Google" sign-in button
   - Complete OAuth flow
   - Verify user data in MongoDB
   - Check JWT token in localStorage

4. **Test JWT verification:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/verify \
     -H "Content-Type: application/json" \
     -d '{"token":"your-jwt-token-here"}'
   ```

## Troubleshooting

### Common Issues

1. **"Cannot find module 'jsonwebtoken'"**
   - Ensure jsonwebtoken is installed: `npm install jsonwebtoken @types/jsonwebtoken`

2. **Google OAuth errors**
   - Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
   - Check authorized redirect URIs in Google Console

3. **JWT verification failures**
   - Ensure NEXTAUTH_SECRET is set
   - Check token expiration
   - Verify token format

4. **Database connection issues**
   - Verify MONGODB_URI is correct
   - Ensure MongoDB is running
   - Check network connectivity

### Debug Mode

Enable debug logging by setting:

```env
NEXTAUTH_DEBUG=true
```

## Next Steps

1. **Production Deployment**
   - Update environment variables for production
   - Configure production Google OAuth credentials
   - Set up secure JWT secret generation

2. **Enhanced Security**
   - Implement refresh token rotation
   - Add rate limiting for authentication endpoints
   - Set up monitoring and logging

3. **User Management**
   - Add user profile management
   - Implement account linking
   - Add role-based access control

## Dependencies Added

```json
{
  "jsonwebtoken": "^9.0.2",
  "@types/jsonwebtoken": "^9.0.10"
}
```

The implementation is now ready for testing and production use!
