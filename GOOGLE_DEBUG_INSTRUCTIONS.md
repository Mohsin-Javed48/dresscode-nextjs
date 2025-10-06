# Google Profile Image Debug Instructions

## Testing Steps

1. **Check Environment Variable:**
   - Make sure you have `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in your `.env.local` file
   - The value should be your Google OAuth Client ID

2. **Test the Flow:**
   - Register with a Gmail address (e.g., `test@gmail.com`)
   - When you reach the OTP screen, check the browser console for these logs:
     - `🔍 OTP useEffect triggered:` - Should show Gmail detection
     - `🚀 Triggering Google Sign-In for Gmail address:` - Should appear
     - `🚀 Getting Google profile image...` - Should appear
     - `🔍 Google Client ID:` - Should show your client ID
     - `✅ Google Sign-In popup displayed` - Should appear when popup shows

3. **Check Google Sign-In:**
   - A Google Sign-In popup should appear automatically
   - Sign in with your Google account
   - Check console for:
     - `🔍 Google callback response:` - Should show the response
     - `🔍 Decoded payload:` - Should show user data
     - `🔍 Profile picture URL:` - Should show the image URL
     - `✅ Setting profile image:` - Should confirm image is set

4. **Check OTP Verification:**
   - Enter the OTP code
   - Check console for:
     - `🔍 Sending OTP verification with data:` - Should show the request
     - `🔍 Profile image being sent:` - Should show the image URL
   - Check server logs for:
     - `🔍 OTP verification request received:`
     - `🔍 Image:` - Should show the image URL
     - `✅ Updating user profile image:` - Should confirm update

## Common Issues

1. **No Google Client ID:** Check `.env.local` file
2. **Google Sign-In not appearing:** Check browser console for errors
3. **No profile image in callback:** Google account might not have a profile picture
4. **Image not saved:** Check server logs for backend errors

## Manual Test

You can also test the Google Sign-In manually by adding this to your browser console on the OTP screen:

```javascript
// Test Google Sign-In manually
if (window.google) {
  window.google.accounts.id.prompt();
} else {
  console.log("Google library not loaded");
}
```
