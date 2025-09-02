import { NextResponse } from "next/server";
import { connectDB } from "@/app/_lib/db";
import Product from "@/app/_models/productModel";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const product = await Product.findById(params.id).populate("reviews");
  return NextResponse.json(product);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const body = await req.json();
  const product = await Product.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return NextResponse.json(product);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Product deleted" });
}
