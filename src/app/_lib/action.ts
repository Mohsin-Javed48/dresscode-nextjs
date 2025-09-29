import { signIn, signOut as nextAuthSignOut } from "next-auth/react";

export async function signInWithGoogle() {
  try {
    await signIn("google", {
      redirectTo: "/",
    });
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
}

export async function signOut() {
  try {
    await nextAuthSignOut({
      redirectTo: "/",
    });
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}
