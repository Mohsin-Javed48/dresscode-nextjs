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
      unique: true,
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
      default: true, // Google OAuth users are pre-verified
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
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
      user.lastLogin = new Date();
      await user.save();
      return user;
    }

    // Create new user
    const nameParts = googleProfile.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

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
    lastLogin: this.lastLogin,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model("User", userSchema);
module.exports = User;
