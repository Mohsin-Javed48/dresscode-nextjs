# Google Authentication Setup Guide

## Environment Variables Required

Create a `.env.local` file in the root directory with the following variables:

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
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Set the authorized redirect URIs to:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
6. Copy the Client ID and Client Secret to your `.env.local` file

## NextAuth Secret

Generate a random secret for NextAuth:

```bash
openssl rand -base64 32
```

Or use any random string generator to create a secure secret.

## Database Setup

Make sure your MongoDB instance is running on `mongodb://localhost:27017/dresscode` or update the `MONGODB_URI` in your `.env.local` file accordingly.

## Testing

1. Start your backend server: `cd server && npm start`
2. Start your frontend server: `npm run dev`
3. Navigate to `http://localhost:3000/login`
4. Click the "Google" sign-in button
5. Complete the Google OAuth flow
6. Check your MongoDB database to verify the user was created

## Troubleshooting

- Make sure all environment variables are set correctly
- Check that MongoDB is running and accessible
- Verify Google OAuth credentials are correct
- Check browser console and server logs for any errors

