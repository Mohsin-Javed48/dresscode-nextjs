import { NextResponse } from "next/server";
import { auth } from "@/app/_lib/auth";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = {
      id: (session.user as { id?: string }).id || "",
      email: session.user.email,
      name: session.user.name || "",
      role: (session.user as { role?: string }).role || "customer",
      provider: (session.user as { provider?: string }).provider || "google",
    };

    const secret = process.env.NEXTAUTH_SECRET || "your-secret-key";
    const token = jwt.sign(payload, secret, {
      expiresIn: "30d",
      issuer: "dresscode-app",
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Mint JWT error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
