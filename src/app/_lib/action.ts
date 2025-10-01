import { signIn, signOut as nextAuthSignOut } from "next-auth/react";
import { generateJWT, verifyJWT, JWTPayload } from "./jwt";

export async function signInWithGoogle() {
  try {
    await signIn("google", {
      redirectTo: "/shop",
    });
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
}

export async function signOut() {
  try {
    // Clear any stored tokens
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user");
    }

    await nextAuthSignOut({
      callbackUrl: "/",
    });
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

export function generateUserJWT(userData: {
  id: string;
  email: string;
  name: string;
  role: string;
  provider: string;
}): string {
  return generateJWT({
    id: userData.id,
    email: userData.email,
    name: userData.name,
    role: userData.role,
    provider: userData.provider,
  });
}

export function verifyUserJWT(token: string): JWTPayload | null {
  return verifyJWT(token);
}

export function storeJWTToken(token: string): void {
  console.log("💾 Attempting to store JWT token...");
  console.log("🌐 Window available:", typeof window !== "undefined");
  console.log(
    "🎫 Token to store:",
    token ? token.substring(0, 50) + "..." : "EMPTY"
  );

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("jwt_token", token);
      console.log("✅ JWT token stored successfully");

      // Verify storage
      const stored = localStorage.getItem("jwt_token");
      console.log(
        "🔍 Verification - stored token:",
        stored ? "SUCCESS" : "FAILED"
      );
    } catch (error) {
      console.error("❌ Failed to store JWT token:", error);
    }
  } else {
    console.warn("⚠️ Window not available, cannot store JWT token");
  }
}

export function getStoredJWTToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt_token");
  }
  return null;
}

export function clearStoredTokens(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
  }
}

// Mint a JWT from server (avoids jsonwebtoken in the browser)
export async function mintAndStoreJWTFromSession(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/mint", { method: "GET" });
    if (!res.ok) {
      console.error("❌ Mint JWT API failed", res.status);
      return null;
    }
    const data = (await res.json()) as { token?: string };
    if (data.token) {
      storeJWTToken(data.token);
      return data.token;
    }
    return null;
  } catch (e) {
    console.error("❌ Mint and store JWT error:", e);
    return null;
  }
}
