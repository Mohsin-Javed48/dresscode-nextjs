import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }], // One-to-Many
    price: { type: Number, required: true },
    category: { type: String, required: true },
    style: String,
    discount: Number,
    image: String,
    size: String,
    season: String,
    stockAvailable: Number,
    description: String,
    gender: String,
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", productSchema);
export default Product;
