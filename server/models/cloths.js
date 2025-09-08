const mongoose = require("mongoose");

const clothSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    style: {
      type: String,
      trim: true,
    },
    discount: {
      type: Number,
      default: 0, // in percentage
      min: 0,
      max: 100,
    },
    image: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"], // restrict to common sizes
      required: true,
    },
    season: {
      type: String,
      enum: ["Summer", "Winter", "Spring", "Autumn", "All"],
      default: "All",
    },
    stockAvailable: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex", "Kids"],
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

const Cloths = mongoose.model("Cloth", clothSchema);
module.exports = Cloths;
