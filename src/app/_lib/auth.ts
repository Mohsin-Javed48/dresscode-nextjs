import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { findOrCreateFromGoogle } from "./db";

const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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

    async signIn({ user, account, profile }) {
      try {
        // console.log("userrrr", user);
        // console.log("accounttttt", account);
        // console.log("profiletttt", profile);

        if (account?.provider === "google" && user?.email && profile) {
          // Find or create user from Google profile
          const googleProfile = {
            id: (profile.sub || profile.id) as string,
            email: user.email,
            name: user.name || "",
            picture: user.image,
            locale: (profile as { locale?: string }).locale || "en",
          };

          await findOrCreateFromGoogle(googleProfile);
          //   console.log("✅ Google user authenticated:", user);
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
