# Google OAuth Setup Guide

## Prerequisites

1. **Google Developer Console Account**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

## Step 1: Enable Google+ API

1. In Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" API

## Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized origins:
   - `http://localhost:3000` (for development)
   - `https://your-production-domain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (NextAuth callback)
6. Save and copy your Client ID and Client Secret

## Step 3: Environment Variables

Create a `.env` file in the server directory:

```env
# Database
MONGODB_URL=mongodb://localhost:27017/dresscode

# Server
PORT=8000
NODE_ENV=development

# JWT Secret (Generate a strong secret key)
JWT_SECRET=your-super-secret-jwt-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Step 4: Install Dependencies

```bash
cd server
npm install
```

## Step 5: Start the Server

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/user/google/callback` - Google OAuth callback
- `GET /api/user/email/:email` - Get user by email
- `POST /api/user` - Create new user
- `GET /api/user/:id` - Get user by ID
- `PUT /api/user/:id` - Update user profile (requires auth)
- `DELETE /api/user/:id` - Delete user (requires auth)
- `GET /api/user` - Get all users (admin only, requires auth)

### Request/Response Examples

#### Google OAuth Callback

```javascript
// Request
POST /api/user/google/callback
{
  "idToken": "google-id-token-here"
}

// Response
{
  "success": true,
  "message": "Authentication successful",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "firstName": "John",
    "lastName": "Doe",
    "image": "profile-image-url",
    "role": "customer",
    "isActive": true,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token-here"
}
```

#### Get User by Email

```javascript
// Request
GET /api/user/email/user@example.com

// Response
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "firstName": "John",
    "lastName": "Doe",
    "image": "profile-image-url",
    "role": "customer",
    "isActive": true,
    "lastLogin": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Frontend Integration

The server is designed to work with NextAuth.js on the frontend. The frontend should:

1. Handle Google OAuth flow
2. Send the Google ID token to `/api/user/google/callback`
3. Store the returned JWT token for authenticated requests
4. Include the JWT token in the `Authorization` header for protected routes

## Security Features

- JWT token authentication
- CORS protection
- Input validation
- Google token verification
- User role-based access control
- Secure password handling (for future local auth)

## Database Schema

The User model includes:

- Google OAuth integration
- Profile information (name, email, image)
- Role-based access control
- Timestamps and activity tracking
- Soft delete functionality
