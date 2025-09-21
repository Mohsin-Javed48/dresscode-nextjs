"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ShoppingCart, Heart } from "lucide-react";
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

const StyleSection = ({
  title,
  subtitle,
  products,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  bgImage,
}: {
  title: string;
  subtitle: string;
  products: Cloth[];
  onAddToCart: (product: Cloth) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: string[];
  bgImage: string;
}) => (
  <section className="mb-16">
    {/* Style Header with Background Image */}
    <div className="relative h-32 rounded-2xl overflow-hidden mb-8">
      <Image
        src={bgImage}
        alt={`${title} style`}
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 flex flex-col justify-center px-8">
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-white/90">{subtitle}</p>
        <div className="text-sm text-white/70 mt-1">
          {products.length} items available
        </div>
      </div>
    </div>

    {/* Products Grid */}
    {products.length > 0 ? (
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
    ) : (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No products available in this style yet.</p>
        <p className="text-sm mt-2">Check back soon for new arrivals!</p>
      </div>
    )}
  </section>
);

export default function StylesPage() {
  const searchParams = useSearchParams();
  const [, setCart] = useState<Cloth[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState("");
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
    const style = searchParams.get("style");
    if (style) {
      setSelectedStyle(style);
      // Scroll to top since selected style will be first
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Filter products by the four main styles
  const casualProducts = cloths.filter(
    (cloth) => cloth.style?.toLowerCase() === "casual"
  );
  const formalProducts = cloths.filter(
    (cloth) => cloth.style?.toLowerCase() === "formal"
  );
  const partyProducts = cloths.filter(
    (cloth) => cloth.style?.toLowerCase() === "party"
  );
  const gymProducts = cloths.filter(
    (cloth) => cloth.style?.toLowerCase() === "gym"
  );

  // Define all style sections
  const allStyleSections = [
    {
      id: "casual",
      title: "Casual",
      subtitle: "Comfortable everyday wear for relaxed occasions",
      products: casualProducts,
      bgImage: "/casual-image.jpg",
    },
    {
      id: "formal",
      title: "Formal",
      subtitle:
        "Professional and elegant attire for business and special events",
      products: formalProducts,
      bgImage: "/formal-image.jpg",
    },
    {
      id: "party",
      title: "Party",
      subtitle: "Stand out with trendy outfits perfect for celebrations",
      products: partyProducts,
      bgImage: "/party-image.jpg",
    },
    {
      id: "gym",
      title: "Gym",
      subtitle: "Performance wear for workouts and active lifestyle",
      products: gymProducts,
      bgImage: "/gym-image.jpg",
    },
  ];

  // Reorder sections to put selected style first
  const orderedStyleSections = selectedStyle
    ? [
        // Selected style first
        ...allStyleSections.filter(
          (section) => section.id === selectedStyle.toLowerCase()
        ),
        // All other styles after
        ...allStyleSections.filter(
          (section) => section.id !== selectedStyle.toLowerCase()
        ),
      ]
    : allStyleSections;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading styles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Browse by Style
            </h1>
            <p className="text-gray-600 text-lg">
              Discover your perfect look for every occasion
            </p>
          </div>

          {/* Style Filter Notification */}
          {selectedStyle && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-700 font-medium">
                Viewing{" "}
                {selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1)}{" "}
                style products
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orderedStyleSections.map((section) => (
          <div
            key={section.id}
            id={`${section.id}-section`}
            className={`transition-all duration-300 ${
              selectedStyle === section.id
                ? "bg-blue-50/50 border border-blue-200 rounded-xl p-6 -m-6"
                : ""
            }`}
          >
            <StyleSection
              title={section.title}
              subtitle={section.subtitle}
              products={section.products}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlist={wishlist}
              bgImage={section.bgImage}
            />
          </div>
        ))}
      </main>
    </div>
  );
}
