import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { findOrCreateFromGoogle } from "./db";

const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
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

    async jwt({ token, user, account, profile }) {
      console.log("🔍 JWT callback - token:", token);
      console.log("🔍 JWT callback - user:", user);
      console.log("🔍 JWT callback - account:", account);
      console.log("🔍 JWT callback - profile:", profile);

      if (account?.provider === "google" && profile) {
        // Store Google profile data in token
        token.picture =
          (profile as { picture?: string }).picture || user?.image;
        token.googleId = (profile.sub || profile.id) as string;
        console.log("🔍 JWT callback - picture set to:", token.picture);
        console.log("🔍 JWT callback - googleId set to:", token.googleId);
      }

      return token;
    },

    async session({ session, token }) {
      console.log("🔍 Session callback - session:", session);
      console.log("🔍 Session callback - token:", token);

      if (token.picture) {
        session.user.image = token.picture as string;
        console.log("🔍 Session callback - image set to:", session.user.image);
      }

      // Add user ID to session
      if (token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }

      // Store user data in localStorage for compatibility with backend API system
      if (typeof window !== "undefined" && session.user) {
        const userData = {
          id: (session.user as { id?: string }).id || "",
          name: session.user.name || "",
          email: session.user.email || "",
          role: (session.user as { role?: string }).role || "customer",
          image: session.user.image || "",
        };

        console.log("🔍 Storing user data in localStorage:", userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      return session;
    },

    async signIn({ user, account, profile }) {
      try {
        console.log("🔍 NextAuth - user:", user);
        console.log("🔍 NextAuth - account:", account);
        console.log("🔍 NextAuth - profile:", profile);

        if (account?.provider === "google" && user?.email && profile) {
          // Find or create user from Google profile
          const googleProfile = {
            id: (profile.sub || profile.id) as string,
            email: user.email,
            name: user.name || "",
            picture:
              (profile as { picture?: string }).picture || user.image || "",
            locale: (profile as { locale?: string }).locale || "en",
          };

          console.log("🔍 NextAuth - googleProfile created:", googleProfile);
          console.log(
            "🔍 NextAuth - picture from profile:",
            (profile as { picture?: string }).picture
          );
          console.log("🔍 NextAuth - picture from user:", user.image);

          const dbUser = await findOrCreateFromGoogle(googleProfile);
          console.log("✅ Google user authenticated:", dbUser);

          // Update the user object with database user data
          if (dbUser) {
            user.id = (
              dbUser as { _id: { toString(): string } }
            )._id.toString();
            user.image = dbUser.image;
            (user as { role?: string }).role = dbUser.role;
            console.log("🔍 Updated user object with DB data:", user);
          }
        }
        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
