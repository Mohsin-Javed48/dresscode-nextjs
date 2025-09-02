import { NextResponse } from "next/server";
import { connectDB } from "@/app/_lib/db";
import Review from "@/app/model/reviewsModel";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  await connectDB();
  const reviews = await Review.find({ product: params.productId });
  return NextResponse.json(reviews);
}
