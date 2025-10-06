# OTP Email Setup Guide

## Problem

The OTP email sending is failing with the error:

```
Error: Invalid login: 534-5.7.9 Application-specific password required
```

This happens because Google requires an application-specific password for Gmail authentication when using 2-factor authentication.

## Solution

### Step 1: Enable 2-Factor Authentication on Gmail

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to Security → 2-Step Verification
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App-Specific Password

1. In your Google Account, go to Security → 2-Step Verification
2. Scroll down to "App passwords"
3. Click "App passwords"
4. Select "Mail" as the app
5. Select "Other (Custom name)" as the device
6. Enter "Dresscode OTP Service" as the name
7. Click "Generate"
8. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variables

1. Open the file: `server/.env`
2. Update the following variables:
   ```
   GMAIL_USER=your-actual-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-character-app-password
   ```

### Step 4: Restart the Server

1. Stop the current server (Ctrl+C)
2. Restart the server:
   ```bash
   cd server
   npm start
   ```

## Alternative Solutions

### Option 1: Use OAuth2 (Recommended for Production)

Instead of app passwords, you can use OAuth2 for more secure authentication:

1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth2 credentials
5. Update the email service to use OAuth2

### Option 2: Use a Different Email Service

Consider using services like:

- SendGrid
- Mailgun
- Amazon SES
- Nodemailer with other SMTP providers

## Testing

After setup, test the OTP functionality by:

1. Going to the signup page
2. Entering valid details
3. Checking if the OTP email is received

## Security Notes

- Never commit the `.env` file to version control
- Use strong, unique app passwords
- Regularly rotate app passwords
- Consider using environment-specific configurations

## Troubleshooting

- If still getting auth errors, verify the app password is correct
- Check that 2FA is enabled on the Gmail account
- Ensure the Gmail account has "Less secure app access" disabled (it should be)
- Verify the email service configuration in `server/services/emailService.js`

