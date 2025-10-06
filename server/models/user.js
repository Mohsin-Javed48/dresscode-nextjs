const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values but ensures uniqueness when present
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    // OAuth provider information
    provider: {
      type: String,
      enum: ["google", "local"],
      default: "google",
    },
    // Additional profile information
    locale: {
      type: String,
      default: "en",
    },
    verified: {
      type: Boolean,
      default: false, // Users need to verify email with OTP
    },
    // OTP fields for email verification
    otp: {
      code: {
        type: String,
        default: null,
      },
      expiresAt: {
        type: Date,
        default: null,
      },
      attempts: {
        type: Number,
        default: 0,
      },
    },
    // Password reset OTP fields
    resetOtp: {
      code: {
        type: String,
        default: null,
      },
      expiresAt: {
        type: Date,
        default: null,
      },
      attempts: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

// Indexes for better performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1 });

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.name;
});

// Method to update last login
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save();
};

// Static method to find or create user from Google profile
userSchema.statics.findOrCreateFromGoogle = async function (googleProfile) {
  try {
    // First, try to find by googleId
    let user = await this.findOne({ googleId: googleProfile.id });

    if (user) {
      // Update last login and return user
      user.lastLogin = new Date();
      await user.save();
      return user;
    }

    // If not found by googleId, try to find by email
    user = await this.findOne({ email: googleProfile.email });

    if (user) {
      // Link the Google account to existing user
      user.googleId = googleProfile.id;
      user.provider = "google";
      user.image = googleProfile.picture || user.image;
      console.log(
        "🔍 Existing user - googleProfile.picture:",
        googleProfile.picture
      );
      console.log("🔍 Full googleProfile:", googleProfile);
      user.lastLogin = new Date();
      await user.save();
      return user;
    }

    console.log(
      "🔍 Existing user not found by googleId, trying by email",
      user
    );

    // Create new user
    const nameParts = googleProfile.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    console.log("🔍 New user - googleProfile.picture:", googleProfile.picture);
    console.log("🔍 Full googleProfile:", googleProfile);

    user = new this({
      googleId: googleProfile.id,
      email: googleProfile.email,
      name: googleProfile.name,
      firstName: firstName,
      lastName: lastName,
      image: googleProfile.picture || "",
      provider: "google",
      locale: googleProfile.locale || "en",
    });

    await user.save();
    return user;
  } catch (error) {
    throw new Error(`Error finding or creating user: ${error.message}`);
  }
};

// Method to get user profile (excluding sensitive data)
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    firstName: this.firstName,
    lastName: this.lastName,
    image: this.image,
    phone: this.phone,
    role: this.role,
    isActive: this.isActive,
    verified: this.verified,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// Method to generate and set OTP for email verification
userSchema.methods.generateOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  this.otp = {
    code: otp,
    expiresAt: expiresAt,
    attempts: 0,
  };

  return otp;
};

// Method to generate and set OTP for password reset
userSchema.methods.generateResetOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  this.resetOtp = {
    code: otp,
    expiresAt: expiresAt,
    attempts: 0,
  };

  return otp;
};

// Method to verify OTP for email verification
userSchema.methods.verifyOTP = async function (inputOtp) {
  console.log("🔍 Verifying OTP:", this.otp);
  if (!this.otp || !this.otp.code) {
    return { success: false, message: "No OTP found" };
  }

  if (this.otp.attempts >= 3) {
    return { success: false, message: "Maximum OTP attempts exceeded" };
  }

  if (new Date() > this.otp.expiresAt) {
    return { success: false, message: "OTP has expired" };
  }

  if (this.otp.code !== inputOtp) {
    this.otp.attempts += 1;
    await this.save();
    return { success: false, message: "Invalid OTP" };
  }

  // OTP is valid, clear it and verify user
  this.otp = { code: null, expiresAt: null, attempts: 0 };
  this.verified = true;
  await this.save();

  return { success: true, message: "Email verified successfully" };
};

// Method to verify OTP for password reset
userSchema.methods.verifyResetOTP = function (inputOtp) {
  if (!this.resetOtp || !this.resetOtp.code) {
    return { success: false, message: "No reset OTP found" };
  }

  if (this.resetOtp.attempts >= 3) {
    return { success: false, message: "Maximum OTP attempts exceeded" };
  }

  if (new Date() > this.resetOtp.expiresAt) {
    return { success: false, message: "OTP has expired" };
  }

  if (this.resetOtp.code !== inputOtp) {
    this.resetOtp.attempts += 1;
    this.save();
    return { success: false, message: "Invalid OTP" };
  }

  // OTP is valid, clear it
  this.resetOtp = { code: null, expiresAt: null, attempts: 0 };
  this.save();

  return { success: true, message: "OTP verified successfully" };
};

const User = mongoose.model("User", userSchema);
module.exports = User;
