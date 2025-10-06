const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Cloth",
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    size: { type: String },
    color: { type: String },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

// Ensure one cart per user (string id supports guests or authenticated users)
cartSchema.index({ userId: 1 }, { unique: true });

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
