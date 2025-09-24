const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const { setUser } = require("../services/auth");
const { getUser } = require("../services/auth");
const { createTokenForUser } = require("../services/authenticate");

async function handleRegister(req, res) {
  try {
    const body = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(body.email);
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const user = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      phone: body.phone,
      avatar: body.avatar,
      role: body.role,
      isActive: body.isActive,
      wishlist: body.wishlist || [],
      cart: body.cart || [],
    });

    console.log("User created successfully:", user);
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);

    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;

    console.log("Login request received for email:", email);
    console.log("Cookies received:", req.cookies);

    // Find user by email and include password field
    const user = await User.findByEmail(email).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        message: "Account is deactivated",
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = createTokenForUser(user);
    return token;

    const sessionId = uuidv4();
    setUser(sessionId, user);

    console.log("Setting cookie with sessionId:", sessionId);

    // Set secure cookie with proper configuration
    res.cookie("uid", sessionId, {
      httpOnly: true, // Prevents XSS attacks
      secure: false, // Set to false for localhost development
      sameSite: "lax", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/", // Available site-wide
    });

    console.log("Cookie set successfully");

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleLogout(req, res) {
  try {
    const userUid = req.cookies.uid;

    if (userUid) {
      // Clear user from session storage
      const { getUser, removeUser } = require("../services/auth");
      const user = getUser(userUid);
      if (user) {
        removeUser(userUid);
        console.log("User logged out:", user.email);
      }
    }

    // Clear the cookie
    res.clearCookie("uid", {
      httpOnly: true,
      secure: false, // Set to false for localhost development
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleVerifySession(req, res) {
  try {
    const userUid = req.cookies.uid;

    if (!userUid) {
      return res.status(401).json({
        message: "No session found",
      });
    }

    const { getUser } = require("../services/auth");
    const user = getUser(userUid);

    if (!user) {
      return res.status(401).json({
        message: "Invalid session",
      });
    }

    return res.status(200).json({
      message: "Session valid",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error verifying session:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  handleRegister,
  handleLogin,
  handleLogout,
  handleVerifySession,
};
