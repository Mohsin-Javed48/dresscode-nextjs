"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import ClothItem from "./ClothItem";

// Function to get cloths from MongoDB API
async function getCloths() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const res = await fetch(`${baseUrl}/api/cloths`, {
      cache: "no-store", // Ensure fresh data
    });

    if (!res.ok) {
      throw new Error("Failed to fetch cloths");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching cloths:", error);
    return [];
  }
}

interface Cloth {
  _id: string;
  name: string;
  rating: number;
  reviews: string;
  price: number;
  category: string;
  style: string;
  discount: number;
  image: string;
  size: string;
  season: string;
  stockAvailable: number;
  description: string;
  gender: string;
  created_at?: string;
  updated_at?: string;
}

// Simple RatingStar component for TopSelling
const RatingStar = ({ value, readOnly = true, size = 16 }) => {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex" style={{ fontSize: `${size}px` }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} className="text-yellow-400">
          ★
        </span>
      ))}
      {hasHalfStar && <span className="text-yellow-400">☆</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={i} className="text-gray-300">
          ☆
        </span>
      ))}
    </div>
  );
};

export default function Page() {
  const router = useRouter();
  const [products, setProducts] = React.useState<Cloth[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const allProducts: Cloth[] = await getCloths();
        // Filter products for topSelling category
        const topSelling = allProducts.filter(
          (product) => product.category === "topSelling"
        );
        setProducts(topSelling);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleViewAll = () => {
    if (showAll) {
      // If already showing all, navigate to shop page
      router.push("/shop?category=topSelling");
    } else {
      // If showing limited, expand to show all
      setShowAll(true);
    }
  };

  // Show only first 4 products initially, or all if showAll is true
  const displayedProducts = showAll ? products : products.slice(0, 4);

  if (loading) {
    return (
      <section className="w-full py-8 bg-white">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            TOP SELLING
          </h1>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-4 bg-white">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          TOP SELLING
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Our most popular items that customers love
        </p>
      </div>

      {/* Products Container */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedProducts.map((product) => (
            <ClothItem key={product._id} product={product} />
          ))}
        </div>

        {/* View All Button - Only show if there are more than 4 items */}
        {products.length > 4 && (
          <div className="mt-12 text-center">
            <button
              onClick={handleViewAll}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300 mr-4"
            >
              {showAll
                ? "Shop All Top Selling"
                : `View All (${products.length} items)`}
            </button>

            {showAll && (
              <button
                onClick={() => setShowAll(false)}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300"
              >
                Show Less
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
