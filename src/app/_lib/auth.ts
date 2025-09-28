import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUser, createUser } from "./user";
import { User } from "@/types";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      role?: "customer" | "admin";
      createdAt?: Date;
      updatedAt?: Date;
    };
    accessToken?: string;
    provider?: string;
  }
}

// Extend the JWT types
declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: "customer" | "admin";
    createdAt?: Date;
    updatedAt?: Date;
    accessToken?: string;
    provider?: string;
  }
}

const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    authorized: ({ auth, request }) => {
      console.log(
        "🔐 Authorized callback - Auth:",
        !!auth?.user,
        "Path:",
        request.nextUrl.pathname
      );
      return !!auth?.user;
    },

    async signIn({ user }) {
      try {
        console.log("🔑 SignIn callback - User:", user.email);

        // Check if user exists in our database
        const existingUser = await getUser(user?.email || "");

        if (!existingUser) {
          // Split name into firstName and lastName
          const fullName = user.name || "";
          const nameParts = fullName.split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          // Create new user with all necessary fields
          const newUser: Partial<User> = {
            email: user.email || "",
            name: user.name || "",
            firstName: firstName,
            lastName: lastName,
            image: user.image || "",
            role: "customer", // Default role
          };

          await createUser(newUser as User);
          console.log("✅ New user created:", user.email);
        } else {
          console.log("✅ Existing user found:", user.email);
        }

        return true;
      } catch (error) {
        console.error("❌ SignIn error:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }

      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;

        // Split name into firstName and lastName
        const fullName = user.name || "";
        const nameParts = fullName.split(" ");
        token.firstName = nameParts[0] || "";
        token.lastName = nameParts.slice(1).join(" ") || "";
      }

      // Fetch user data from database on each JWT creation
      if (token.email) {
        try {
          const dbUser = await getUser(token.email);
          if (dbUser) {
            token.firstName = dbUser.firstName || token.firstName;
            token.lastName = dbUser.lastName || token.lastName;
            token.phone = dbUser.phone;
            token.role = dbUser.role || "customer";
            token.createdAt = dbUser.createdAt;
            token.updatedAt = dbUser.updatedAt;
          }
        } catch (error) {
          console.error("Error fetching user data in JWT:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.userId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.phone = token.phone as string;
        session.user.role = token.role as "customer" | "admin";
        session.user.createdAt = token.createdAt as Date;
        session.user.updatedAt = token.updatedAt as Date;
        session.accessToken = token.accessToken as string;
        session.provider = token.provider as string;
      }

      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log("🎉 User signed in:", {
        email: user.email,
        provider: account?.provider,
        isNewUser,
      });
    },
    async signOut() {
      console.log("👋 User signed out");
    },
  },
  debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export const { GET, POST } = handlers;
