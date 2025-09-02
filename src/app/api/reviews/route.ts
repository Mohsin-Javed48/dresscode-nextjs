import { NextResponse } from "next/server";
import { connectDB } from "@/app/_lib/db";
import Review from "@/app/_models/reviewsModel";
import Product from "@/app/_models/productModel";

export async function POST(req: Request) {
  await connectDB();
  const { productId, userName, comment, rating } = await req.json();

  const review = await Review.create({
    product: productId,
    userName,
    comment,
    rating,
  });

  await Product.findByIdAndUpdate(productId, {
    $push: { reviews: review._id },
  });

  return NextResponse.json(review, { status: 201 });
}
