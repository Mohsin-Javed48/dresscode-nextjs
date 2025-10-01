import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key";

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  provider: string;
  iat?: number;
  exp?: number;
}

export function generateJWT(payload: Omit<JWTPayload, "iat" | "exp">): string {
  console.log("🔧 Generating JWT with payload:", payload);
  console.log("🔑 JWT Secret available:", !!JWT_SECRET);
  console.log("🔑 JWT Secret length:", JWT_SECRET?.length);

  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "30d",
      issuer: "dresscode-app",
    });
    console.log(
      "✅ JWT generated successfully:",
      token.substring(0, 50) + "..."
    );
    return token;
  } catch (error) {
    console.error("❌ JWT generation failed:", error);
    throw error;
  }
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Token expiration check error:", error);
    return true;
  }
}
