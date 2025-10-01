import mongoose, { Schema, Model, Document } from "mongoose";
import { User } from "@/types";

// Define the User document interface
interface IUser extends Document {
  googleId?: string;
  email: string;
  password?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  image: string;
  phone: string;
  role: "customer" | "admin";
  isActive: boolean;
  lastLogin: Date;
  provider: "google" | "local";
  locale: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  getPublicProfile(): {
    id: string;
    email: string;
    name: string;
    firstName?: string;
    lastName?: string;
    image: string;
    phone: string;
    role: "customer" | "admin";
    isActive: boolean;
    lastLogin: Date;
    createdAt: Date;
    updatedAt: Date;
  };
}

// Define the User model interface
interface IUserModel extends Model<IUser> {
  findOrCreateFromGoogle(googleProfile: GoogleProfile): Promise<IUser>;
}

// Google profile interface
interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  picture?: string | null;
  locale?: string;
}

// User schema for NextAuth
const userSchema = new Schema<IUser, IUserModel>(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
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
      required: function (this: IUser): boolean {
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
    provider: {
      type: String,
      enum: ["google", "local"],
      default: "google",
    },
    locale: {
      type: String,
      default: "en",
    },
    verified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

// Static method to find or create user from Google profile
userSchema.statics.findOrCreateFromGoogle = async function (
  googleProfile: GoogleProfile
): Promise<IUser> {
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
    throw new Error(
      `Error finding or creating user: ${(error as Error).message}`
    );
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

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return mongoose.connections[0];
    }

    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/dresscode"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

// Get or create User model
const getUserModel = async (): Promise<IUserModel> => {
  await connectDB();

  if (mongoose.models.User) {
    return mongoose.models.User as IUserModel;
  }

  return mongoose.model<IUser, IUserModel>("User", userSchema);
};

// Database functions
export async function getUser(email: string): Promise<IUser | null> {
  try {
    const UserModel = await getUserModel();
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export async function createUser(
  userData: Partial<User>
): Promise<IUser | null> {
  try {
    const UserModel = await getUserModel();

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      email: userData.email?.toLowerCase(),
    });
    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const user = new UserModel({
      email: userData.email?.toLowerCase(),
      name: userData.name || "",
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      image: userData.image || "",
      phone: userData.phone || "",
      role: userData.role || "customer",
      provider: "google",
    });

    await user.save();
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function findOrCreateFromGoogle(
  googleProfile: GoogleProfile
): Promise<IUser> {
  try {
    const UserModel = await getUserModel();
    const newUser = await UserModel.findOrCreateFromGoogle(googleProfile);
    // Note: localStorage is not available on server-side
    // User data should be stored in localStorage on the client-side
    return newUser;
  } catch (error) {
    console.error("Error finding or creating Google user:", error);
    throw error;
  }
}
