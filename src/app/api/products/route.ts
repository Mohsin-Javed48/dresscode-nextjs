import { NextResponse } from "next/server";
import { connectDB } from "@/app/_lib/db";
import Product from "@/app/_models/productModel";

export async function GET() {
  await connectDB();
  const products = await Product.find().populate("reviews");
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const product = await Product.create(body);
  return NextResponse.json(product, { status: 201 });
}
