import { connectDB } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const db = await connectDB();

  // Get product
  const [productRows] = await db.query("SELECT * FROM cloths WHERE id = ?", [
    params.id,
  ]);
  const product = productRows[0];

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Get related reviews
  const [reviews] = await db.query(
    "SELECT * FROM reviews WHERE product_id = ?",
    [params.id]
  );

  return NextResponse.json({ ...product, reviews });
}
