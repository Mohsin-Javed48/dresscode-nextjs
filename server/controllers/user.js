const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  verifyGoogleToken,
  validateGoogleProfile,
} = require("../utils/googleAuth");
const emailService = require("../services/emailService");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "30d",
  });
};

// Google OAuth callback handler
async function handleGoogleCallback(req, res) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google ID token is required",
      });
    }

    // Verify Google token
    const googleProfile = await verifyGoogleToken(idToken);
    console.log(
      "🔍 Google OAuth - Full googleProfile received:",
      googleProfile
    );
    console.log(
      "🔍 Google OAuth - googleProfile.picture:",
      googleProfile.picture
    );

    // Validate profile data
    if (!validateGoogleProfile(googleProfile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Google profile data",
      });
    }

    // Find or create user
    const user = await User.findOrCreateFromGoogle(googleProfile);
    console.log("🔍 User found/created:", user);

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Failed to create or find user",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Get public profile and log it
    const publicProfile = user.getPublicProfile();
    console.log("🔍 Public profile being sent to frontend:", publicProfile);
    console.log("🔍 User image in public profile:", publicProfile.image);

    // Return user data and token
    res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: publicProfile,
      token,
    });
  } catch (error) {
    console.error("Google callback error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get user by email
async function getUserByEmail(req, res) {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Get user by email error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Create new user
async function createUser(req, res) {
  try {
    const { email, name, firstName, lastName, image, phone, role } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Email and name are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
        user: existingUser.getPublicProfile(),
      });
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      name,
      firstName: firstName || "",
      lastName: lastName || "",
      image: image || "",
      phone: phone || "",
      role: role || "customer",
      provider: "google",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get user by ID
async function getUserById(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Update user profile
async function updateUserProfile(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.googleId;
    delete updateData.provider;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const user = await User.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Get all users (admin only)
async function getAllUsers(req, res) {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-googleId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      users: users.map((user) => user.getPublicProfile()),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Delete user
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// Traditional login with email and password
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "user not found",
      });
    }

    // Check if user has a password (not OAuth only)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "Please use Google sign-in for this account",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: user.getPublicProfile(),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Traditional register with email and password - sends OTP for verification
async function register(req, res) {
  try {
    const { email, password, firstName, lastName, phone, image } = req.body;
    console.log("register", JSON.stringify(req.body.image));
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Email, password, first name, and last name are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user (not verified yet)
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      phone: phone || "",
      image: image || "", // Include image if provided
      role: "customer",
      provider: "local",
      verified: false,
    });

    await user.save();

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    const emailResult = await emailService.sendOTPEmail(email, otp, "signup");

    if (!emailResult.success) {
      // If email fails, delete the user
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email for verification code.",
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Logout user
async function logout(req, res) {
  try {
    // For JWT-based auth, logout is handled client-side
    // We can add token blacklisting here if needed
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Verify session/token
async function verifySession(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );

      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Invalid token or user not found",
        });
      }

      res.status(200).json({
        success: true,
        user: user.getPublicProfile(),
      });
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    console.error("Verify session error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Verify OTP for email verification
async function verifyOTP(req, res) {
  try {
    const { userId, otp, image } = req.body;

    console.log("🔍 OTP verification request received:");
    console.log("🔍 User ID:", userId);
    console.log("🔍 OTP:", otp);
    console.log("🔍 Image:", image);

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "User ID and OTP are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const result = await user.verifyOTP(otp);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // Update user profile image if provided
    if (image && image.trim() !== "") {
      console.log("✅ Updating user profile image:", image);
      user.image = image;
      // user.save() may race with verifyOTP's save; refetch latest doc and update atomically
      await User.updateOne({ _id: user._id }, { $set: { image } });
      console.log("✅ User profile image updated successfully");
    } else {
      console.log("❌ No image provided or image is empty");
    }

    // Generate JWT token after successful verification
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: result.message,
      user: user.getPublicProfile(),
      token,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Resend OTP for email verification
async function resendOTP(req, res) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    const emailResult = await emailService.sendOTPEmail(
      user.email,
      otp,
      "signup"
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Forgot password - send OTP
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Generate reset OTP
    const otp = user.generateResetOTP();
    await user.save();

    // Send OTP email
    const emailResult = await emailService.sendOTPEmail(email, otp, "forgot");

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Password reset code sent to your email",
      userId: user._id,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Verify reset OTP
async function verifyResetOTP(req, res) {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "User ID and OTP are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const result = user.verifyResetOTP(otp);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
      userId: user._id,
    });
  } catch (error) {
    console.error("Verify reset OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

// Reset password with OTP
async function resetPassword(req, res) {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "User ID and new password are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has verified reset OTP (resetOtp should be cleared after verification)
    if (user.resetOtp && user.resetOtp.code) {
      return res.status(400).json({
        success: false,
        message: "Please verify OTP first",
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}

module.exports = {
  handleGoogleCallback,
  getUserByEmail,
  createUser,
  getUserById,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  verifyToken,
  login,
  register,
  logout,
  verifySession,
  verifyOTP,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
};
