"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ShoppingCart, Search, Heart } from "lucide-react";
import { RatingStar } from "@/app/_components/RatingStar";
import Image from "next/image";

// Define the Cloth interface to match MongoDB schema
interface Cloth {
  _id: string;
  name: string;
  rating: number;
  price: number;
  originalPrice?: number;
  discount: number;
  category: string;
  image: string;
  size: string[];
  gender: string;
  style?: string;
  description?: string;
}

// Function to fetch cloths from MongoDB API
async function getCloths(): Promise<Cloth[]> {
  try {
    const response = await fetch("http://localhost:8000/api/cloths");
    if (!response.ok) {
      throw new Error("Failed to fetch cloths");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching cloths:", error);
    return [];
  }
}

const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}: {
  product: Cloth;
  onAddToCart: (product: Cloth) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
}) => {
  const originalPrice =
    product.discount > 0
      ? Math.round(product.price / (1 - product.discount / 100))
      : undefined;

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist(product._id)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500"
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Quick Add to Cart - appears on hover */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-black/90 backdrop-blur-sm text-white py-2 px-4 rounded-lg font-medium hover:bg-black transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 space-y-2">
        {/* Brand/Style */}
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          {product.style || "Casual"}
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <RatingStar value={product.rating} readOnly size={14} />
          <span className="text-xs text-gray-600">({product.rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            Rs {product.price}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              Rs {originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const CategorySection = ({
  title,
  subtitle,
  products,
  onAddToCart,
  onToggleWishlist,
  wishlist,
}: {
  title: string;
  subtitle: string;
  products: Cloth[];
  onAddToCart: (product: Cloth) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
}) => (
  <section className="mb-16">
    {/* Section Header */}
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <div className="text-sm text-gray-500">{products.length} items</div>
      </div>
    </div>

    {/* Products Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isWishlisted={wishlist.includes(product._id)}
        />
      ))}
    </div>
  </section>
);

export default function ProductCategoriesPage() {
  const searchParams = useSearchParams();
  const [cart, setCart] = useState<Cloth[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cloths, setCloths] = useState<Cloth[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cloths data
  useEffect(() => {
    async function fetchCloths() {
      setLoading(true);
      try {
        const fetchedCloths = await getCloths();
        setCloths(fetchedCloths);
      } catch (error) {
        console.error("Error loading cloths:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCloths();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
      // Scroll to the specific category section
      const element = document.getElementById(`${category}-section`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [searchParams]);

  const handleAddToCart = (product: Cloth) => {
    setCart((prev) => [...prev, product]);
    alert(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Filter products by category
  const topSellingProducts = cloths.filter(
    (cloth) => cloth.category === "topSelling"
  );
  const newArrivalProducts = cloths.filter(
    (cloth) => cloth.category === "newArrival"
  );
  const trendingNowProducts = cloths.filter(
    (cloth) => cloth.category === "trendingNow"
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Shop Collection
            </h1>
            <p className="text-gray-600">Discover our latest fashion trends</p>
          </div>

          {/* Category Filter Notification */}
          {selectedCategory && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-blue-700 font-medium">
                Viewing{" "}
                {selectedCategory === "topSelling"
                  ? "Top Selling"
                  : selectedCategory === "newArrival"
                    ? "New Arrivals"
                    : selectedCategory === "trendingNow"
                      ? "Trending Now"
                      : selectedCategory}{" "}
                products
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Selling */}
        <div
          id="topSelling-section"
          className={`transition-all duration-300 ${
            selectedCategory === "topSelling"
              ? "bg-blue-50/50 border border-blue-200 rounded-xl p-6 -m-6"
              : ""
          }`}
        >
          <CategorySection
            title="Top Selling"
            subtitle="Our most popular items that customers love"
            products={topSellingProducts}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          />
        </div>

        {/* New Arrivals */}
        <div
          id="newArrival-section"
          className={`transition-all duration-300 ${
            selectedCategory === "newArrival"
              ? "bg-blue-50/50 border border-blue-200 rounded-xl p-6 -m-6"
              : ""
          }`}
        >
          <CategorySection
            title="New Arrivals"
            subtitle="Fresh styles just landed in our collection"
            products={newArrivalProducts}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          />
        </div>

        {/* Trending Now */}
        <div
          id="trendingNow-section"
          className={`transition-all duration-300 ${
            selectedCategory === "trendingNow"
              ? "bg-blue-50/50 border border-blue-200 rounded-xl p-6 -m-6"
              : ""
          }`}
        >
          <CategorySection
            title="Trending Now"
            subtitle="What's hot right now in fashion"
            products={trendingNowProducts}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlist={wishlist}
          />
        </div>
      </main>
    </div>
  );
}
