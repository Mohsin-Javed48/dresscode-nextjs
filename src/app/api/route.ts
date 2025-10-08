import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Dresscode Backend API is running!",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      auth: "/api/auth",
      reviews: "/api/reviews",
    },
    status: "healthy",
  });
}

export async function POST() {
  return NextResponse.json({
    message: "Dresscode Backend API is running!",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      auth: "/api/auth",
      reviews: "/api/reviews",
    },
    status: "healthy",
  });
}
