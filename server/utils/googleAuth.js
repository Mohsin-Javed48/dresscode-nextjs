const { OAuth2Client } = require("google-auth-library");

// Initialize Google OAuth client
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

/**
 * Verify Google ID token and extract user information
 * @param {string} idToken - Google ID token from client
 * @returns {Object} User profile information
 */
async function verifyGoogleToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      locale: payload.locale,
      verified_email: payload.email_verified,
    };
  } catch (error) {
    throw new Error(`Google token verification failed: ${error.message}`);
  }
}

/**
 * Validate Google profile data
 * @param {Object} profile - Google profile object
 * @returns {boolean} True if valid
 */
function validateGoogleProfile(profile) {
  const requiredFields = ["id", "email", "name"];

  for (const field of requiredFields) {
    if (!profile[field]) {
      return false;
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(profile.email)) {
    return false;
  }

  return true;
}

module.exports = {
  verifyGoogleToken,
  validateGoogleProfile,
};
