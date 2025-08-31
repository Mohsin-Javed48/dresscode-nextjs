import { connectDB } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { product_id, user_id, rating, review_title, review_text } =
    await req.json();
  const db = await connectDB();

  await db.query(
    "INSERT INTO reviews (product_id, user_id, rating, review_title, review_text) VALUES (?, ?, ?, ?, ?)",
    [product_id, user_id, rating, review_title, review_text]
  );

  return NextResponse.json({ message: "Review added successfully" });
}
