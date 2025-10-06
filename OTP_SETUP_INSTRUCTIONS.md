# OTP Email Verification Setup Instructions

This document explains how to set up OTP email verification for both signup and forgot password functionality.

## Backend Setup

### 1. Install Dependencies

```bash
cd server
npm install nodemailer
```

### 2. Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/dresscode

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Gmail Configuration for OTP emails
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password-here

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server Configuration
PORT=8000
NODE_ENV=development
```

### 3. Gmail App Password Setup

To send emails through Gmail, you need to:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `GMAIL_APP_PASSWORD` in your .env file

## Features Implemented

### 1. Signup with OTP Verification

- User fills out signup form
- System creates user account (unverified)
- Sends OTP to user's email
- User enters OTP to verify email
- Account becomes verified and user is logged in

### 2. Forgot Password with OTP

- User enters email on forgot password page
- System sends OTP to email
- User enters OTP to verify identity
- User sets new password
- User is redirected to login page

### 3. API Endpoints

#### Signup Flow

- `POST /api/user/register` - Creates user and sends OTP
- `POST /api/user/verify-otp` - Verifies OTP and activates account
- `POST /api/user/resend-otp` - Resends OTP if needed

#### Forgot Password Flow

- `POST /api/user/forgot-password` - Sends reset OTP
- `POST /api/user/verify-reset-otp` - Verifies reset OTP
- `POST /api/user/reset-password` - Sets new password

### 4. Security Features

- OTP expires in 10 minutes
- Maximum 3 OTP attempts before lockout
- OTP is cleared after successful verification
- Password requirements enforced
- JWT tokens for authenticated sessions

## Frontend Pages

### 1. Updated Signup Page (`/signup`)

- Shows OTP verification screen after registration
- 6-digit OTP input with auto-focus
- Resend OTP functionality
- Back to form option

### 2. New Forgot Password Page (`/forgot-password`)

- Email input form
- OTP verification screen
- New password setting form
- Complete flow with proper navigation

### 3. Updated Login Page (`/login`)

- Added "Forgot password?" link
- Links to forgot password page

## Database Schema Updates

The User model now includes:

```javascript
// OTP fields for email verification
otp: {
  code: String,
  expiresAt: Date,
  attempts: Number
},

// Password reset OTP fields
resetOtp: {
  code: String,
  expiresAt: Date,
  attempts: Number
},

verified: {
  type: Boolean,
  default: false
}
```

## Testing the Implementation

1. Start the backend server:

   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend:

   ```bash
   npm run dev
   ```

3. Test the signup flow:
   - Go to `/signup`
   - Fill out the form
   - Check your email for OTP
   - Enter OTP to complete registration

4. Test the forgot password flow:
   - Go to `/login`
   - Click "Forgot password?"
   - Enter your email
   - Check email for OTP
   - Enter OTP and set new password

## Troubleshooting

### Email Not Sending

- Check Gmail credentials in .env
- Ensure 2FA is enabled and app password is correct
- Check server logs for email service errors

### OTP Not Working

- Check if OTP has expired (10 minutes)
- Verify OTP attempts haven't exceeded limit (3 attempts)
- Check database for OTP data

### Database Issues

- Ensure MongoDB is running
- Check connection string in .env
- Verify user model schema is updated

## Security Considerations

- OTPs are stored hashed in the database
- Rate limiting should be implemented for production
- Consider implementing CAPTCHA for additional security
- Monitor for suspicious activity and implement account lockouts
- Use HTTPS in production for secure email transmission
