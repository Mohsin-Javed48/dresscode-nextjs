# Google Profile Image Setup for Form Registration

This guide explains how to set up Google profile image fetching during user registration.

## Overview

The signup form now includes an optional "Get Google Profile Image" button that allows users to:

1. Sign in with their Google account
2. Automatically fetch their Google profile image
3. Pre-populate form fields with Google account data
4. Continue with the regular form registration process

## Setup Instructions

### 1. Environment Variables

Add the following environment variable to your `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 2. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Identity API
4. Go to "Credentials" and create a new OAuth 2.0 Client ID
5. Set the application type to "Web application"
6. Add your domain to authorized origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
7. Copy the Client ID and add it to your environment variables

### 3. Features

#### Frontend (Signup Form)

- **Profile Image Section**: Added between phone and password fields
- **Google Sign-In Button**: Uses Google Identity Services library
- **Image Preview**: Shows the fetched Google profile image
- **Form Pre-population**: Automatically fills first name, last name, and email
- **Remove Image**: Users can remove the Google image if desired

#### Backend (Registration API)

- **Image Support**: Registration endpoint now accepts an `image` parameter
- **Database Storage**: User model stores the Google profile image URL
- **Backward Compatibility**: Works with or without profile images

### 4. How It Works

1. User clicks "Get Google Profile Image" button
2. Google Sign-In popup appears
3. User signs in with their Google account
4. System extracts profile data from Google's JWT token:
   - Profile image URL
   - Name (split into first/last name)
   - Email address
5. Form is pre-populated with Google data
6. User can continue filling the form and submit
7. Registration includes the Google profile image

### 5. Technical Implementation

#### Frontend Components

- Uses Google Identity Services library
- JWT token decoding for profile data extraction
- State management for profile image and form data
- TypeScript interfaces for type safety

#### Backend Integration

- Modified registration controller to accept image parameter
- Updated user model to store profile images
- Maintains existing OTP verification flow

### 6. Security Considerations

- Google profile images are stored as URLs (not uploaded files)
- JWT tokens are decoded client-side only
- No sensitive Google data is stored in the database
- Existing security measures (OTP verification, password hashing) remain intact

### 7. User Experience

- **Optional Feature**: Users can skip Google image and use regular registration
- **Seamless Integration**: Google sign-in doesn't redirect away from the form
- **Visual Feedback**: Clear indication when Google image is loaded
- **Easy Removal**: Users can easily remove the Google image if needed

## Testing

1. Start your development server
2. Navigate to the signup page
3. Click "Get Google Profile Image"
4. Sign in with a Google account
5. Verify the form is pre-populated and image is displayed
6. Complete the registration process
7. Check that the user profile includes the Google image

## Troubleshooting

### Common Issues

1. **Google Sign-In not working**: Check that `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
2. **Image not displaying**: Verify the Google profile has a public profile image
3. **Form not pre-populating**: Check browser console for JWT decoding errors
4. **CORS errors**: Ensure your domain is added to Google OAuth authorized origins

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test with different Google accounts
4. Check network requests in browser dev tools
