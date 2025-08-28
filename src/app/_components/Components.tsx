"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  ShoppingCart,
  User,
  Menu,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Gradient Graphic T-shirt",
    price: 145,
    originalPrice: null,
    rating: 3.6,
    reviews: "3.6k",
    image: "/api/placeholder/300/300",
    colors: ["white"],
  },
  {
    id: 2,
    name: "Polo with Tipping Details",
    price: 180,
    originalPrice: null,
    rating: 4.5,
    reviews: "4.5k",
    image: "/api/placeholder/300/300",
    colors: ["pink"],
  },
  {
    id: 3,
    name: "Black Striped T-shirt",
    price: 120,
    originalPrice: 150,
    rating: 5.0,
    reviews: "5.0k",
    image: "/api/placeholder/300/300",
    colors: ["black", "white"],
  },
  {
    id: 4,
    name: "Skinny Fit Jeans",
    price: 240,
    originalPrice: 260,
    rating: 3.5,
    reviews: "3.5k",
    image: "/api/placeholder/300/300",
    colors: ["blue"],
  },
  {
    id: 5,
    name: "Checkered Shirt",
    price: 180,
    originalPrice: null,
    rating: 4.5,
    reviews: "4.5k",
    image: "/api/placeholder/300/300",
    colors: ["red", "blue"],
  },
  {
    id: 6,
    name: "Sleeve Striped T-shirt",
    price: 130,
    originalPrice: 160,
    rating: 4.5,
    reviews: "4.5k",
    image: "/api/placeholder/300/300",
    colors: ["orange", "black"],
  },
  {
    id: 7,
    name: "Vertical Striped Shirt",
    price: 212,
    originalPrice: 232,
    rating: 5.0,
    reviews: "5.0k",
    image: "/api/placeholder/300/300",
    colors: ["green"],
  },
  {
    id: 8,
    name: "Courage Graphic T-shirt",
    price: 145,
    originalPrice: null,
    rating: 4.0,
    reviews: "4.0k",
    image: "/api/placeholder/300/300",
    colors: ["orange"],
  },
  {
    id: 9,
    name: "Loose Fit Bermuda Shorts",
    price: 80,
    originalPrice: null,
    rating: 3.0,
    reviews: "3.0k",
    image: "/api/placeholder/300/300",
    colors: ["blue"],
  },
];

const colors = [
  { name: "Green", value: "bg-green-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Yellow", value: "bg-yellow-400" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Blue", value: "bg-blue-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Pink", value: "bg-pink-500" },
  { name: "Black", value: "bg-black" },
];

const sizes = [
  "XX-Small",
  "X-Small",
  "Small",
  "Medium",
  "Large",
  "X-Large",
  "XX-Large",
  "3X-Large",
  "4X-Large",
];

const dressStyles = ["Casual", "Formal", "Party", "Gym"];

export default function ProductListing() {
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [priceRange, setPriceRange] = useState([50, 200]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Most Popular");

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  const calculateDiscount = (price, originalPrice) => {
    if (!originalPrice) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className="max-w-screen px-32  lg:px-8 py-6">
      {/* Breadcrumb */}
      <div className="max-w-7xl  px-4 py-4">
        <div className="flex items-left space-x-2 text-sm text-gray-600">
          <span>Home</span>
          <span>›</span>
          <span className="text-black font-medium">Casual</span>
        </div>
      </div>

      <div className="min-w-screen-dvw mx-auto px-4 flex gap-8">
        {/* Sidebar Filters */}
        <div className="w-64 flex-shrink-0 hidden lg:block">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Filters</h3>
              <Menu className="w-5 h-5" />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <div className="space-y-3">
                {["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"].map(
                  (category) => (
                    <div
                      key={category}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="text-gray-600">{category}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Price</h4>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm bg-gray-100 px-3 py-1 rounded">
                  ${priceRange[0]}
                </span>
                <span className="text-sm bg-gray-100 px-3 py-1 rounded">
                  ${priceRange[1]}
                </span>
              </div>
            </div>

            {/* Colors */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Colors</h4>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="grid grid-cols-5 gap-3">
                {colors.map((color) => (
                  <div
                    key={color.name}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                      color.value
                    } ${
                      selectedColors.includes(color.name)
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    onClick={() => {
                      setSelectedColors((prev) =>
                        prev.includes(color.name)
                          ? prev.filter((c) => c !== color.name)
                          : [...prev, color.name]
                      );
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Size</h4>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`text-xs py-2 px-3 rounded border ${
                      selectedSizes.includes(size)
                        ? "bg-black text-white border-black"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                    onClick={() => {
                      setSelectedSizes((prev) =>
                        prev.includes(size)
                          ? prev.filter((s) => s !== size)
                          : [...prev, size]
                      );
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Dress Style */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Dress Style</h4>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="space-y-3">
                {dressStyles.map((style) => (
                  <div
                    key={style}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-gray-600">{style}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-black text-white py-3 rounded-full font-medium">
              Apply Filter
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Casual</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Showing 1-10 of 100 Products
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Sort by:</span>
                <div className="flex items-center space-x-1">
                  <span className="font-medium">{sortBy}</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="bg-gray-100 rounded-lg mb-4 aspect-square overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500">
                    Product Image
                  </div>
                </div>
                <h3 className="font-medium mb-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating}/5
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">${product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                      <span className="text-red-500 text-sm bg-red-50 px-2 py-1 rounded-full">
                        -
                        {calculateDiscount(
                          product.price,
                          product.originalPrice
                        )}
                        %
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex items-center space-x-2">
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </div>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, "...", 8, 9, 10].map((page, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded ${
                    page === currentPage
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    typeof page === "number" && setCurrentPage(page)
                  }
                >
                  {page}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
