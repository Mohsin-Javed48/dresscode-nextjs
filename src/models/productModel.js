import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  title: { type: String, required: true },
  rating: { type: Number, default: 0 }, // calculated average
  price: { type: Number, required: true },
  category: { type: String, required: true },
  style: { type: String },
  discount: { type: Number, default: 0 },
  image: { type: String },
  size: { type: String },
  season: { type: String },
  stockAvailable: { type: Number, default: 0 },
  description: { type: String },
  gender: { type: String },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }], // Relation
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
