"use client";
import React, { useState } from "react";
import { Star, StarHalf, Plus, Minus, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function ProductPage() {
  const [selectedColor, setSelectedColor] = useState("olive");
  const [selectedSize, setSelectedSize] = useState("Large");
  const [quantity, setQuantity] = useState(1);

  const colors = [
    {
      name: "olive",
      color: "bg-green-800",
      selected: selectedColor === "olive",
    },
    { name: "teal", color: "bg-teal-600", selected: selectedColor === "teal" },
    { name: "navy", color: "bg-blue-900", selected: selectedColor === "navy" },
  ];

  const sizes = ["Small", "Medium", "Large", "X-Large"];

  const productImages = [
    "/party-image.jpg",
    "/party-image.jpg",
    "/party-image.jpg",
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const handleQuantityChange = (action) => {
    if (action === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-screen px-12  lg:px-12 py-6">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6">
        <ul className="flex flex-wrap items-center gap-2 text-sm">
          {["Home", "Shop", "Men", "T-shirts"].map((item, index) => (
            <li key={item} className="flex items-center">
              <p className="text-gray-500 hover:text-gray-800 cursor-pointer">
                {item}
              </p>
              {index < 3 && (
                <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-sm">
        {/* Left Side: Images */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-2">
            {productImages.map((image, index) => (
              <div
                key={index}
                className="relative w-20 h-20 md:w-24 md:h-24 border-2 border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-gray-400 transition-colors"
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Main Product Image */}
          <div className="flex-1 h-[500px] relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <Image
              src="/party-image.jpg"
              alt="Main product"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="space-y-8">
          {/* Title and Rating */}
          <div>
            <h1 className="text-2xl lg:text-4xl font-extrabold text-gray-900 leading-snug text-left">
              ONE LIFE GRAPHIC T-SHIRT
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">{renderStars(4.5)}</div>
              <span className="text-sm text-gray-600">4.5/5</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-2xl lg:text-3xl font-bold text-gray-900">
              $260
            </span>
            <span className="text-lg text-gray-400 line-through">$300</span>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
              -40%
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
            This graphic t-shirt is perfect for any occasion. Crafted from a
            soft and breathable fabric, it offers superior comfort and style.
          </p>

          {/* Color Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3 text-left">
              Select Colors
            </h3>
            <div className="flex gap-2">
              {colors.map((colorOption) => (
                <button
                  key={colorOption.name}
                  onClick={() => setSelectedColor(colorOption.name)}
                  className={`w-8 h-8 rounded-full ${
                    colorOption.color
                  } border-2 ${
                    colorOption.selected ? "border-gray-900" : "border-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3 text-left">
              Choose Size
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 px-4 text-sm font-medium rounded-full border ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Quantity */}
            <div className="flex items-center border border-gray-200 rounded-full">
              <button
                onClick={() => handleQuantityChange("decrement")}
                className="p-2 hover:bg-gray-50 rounded-l-full"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange("increment")}
                className="p-2 hover:bg-gray-50 rounded-r-full"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart */}
            <button className="flex-1 bg-black text-white py-3 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
