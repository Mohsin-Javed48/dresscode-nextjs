"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { RatingStar } from "@/app/_components/RatingStar";
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

export default function Page() {
  const router = useRouter();
  const [products, setProducts] = React.useState<Cloth[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const allProducts: Cloth[] = await getCloths();
        // Filter products for newArrival category
        const newArrivals = allProducts.filter(
          (product) => product.category === "newArrival"
        );
        setProducts(newArrivals);
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
      router.push("/shop?category=newArrival");
    } else {
      // If showing limited, expand to show all
      setShowAll(true);
    }
  };

  // Show only first 5 products initially, or all if showAll is true
  const displayedProducts = showAll ? products : products.slice(0, 5);

  if (loading) {
    return (
      <section className="w-full py-16 bg-white">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            NEW ARRIVALS
          </h1>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-white">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          NEW ARRIVALS
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover our latest collection of premium clothing
        </p>
      </div>

      {/* Products Container */}
      <div className="container max-w-7xl min-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {displayedProducts.map((product) => (
            <ClothItem key={product._id} product={product} />
          ))}
        </div>

        {/* View All Button - Only show if there are more than 5 items */}
        {products.length > 5 && (
          <div className="mt-12 text-center">
            <button
              onClick={handleViewAll}
              className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-300 mr-4"
            >
              {showAll
                ? "Shop All New Arrivals"
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
