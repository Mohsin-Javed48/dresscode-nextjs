"use client";

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";
import { RatingStar } from "@/app/_components/RatingStar";

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

export default function TrendingNow() {
  const router = useRouter();
  const [products, setProducts] = React.useState<Cloth[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const allProducts: Cloth[] = await getCloths();
        // Filter products for trendingNow category
        const trending = allProducts.filter(
          (product) => product.category === "trendingNow"
        );
        setProducts(trending);
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
      router.push("/shop?category=trendingNow");
    } else {
      // If showing limited, expand to show all
      setShowAll(true);
    }
  };

  // Show only first 4 products initially, or all if showAll is true
  const displayedProducts = showAll ? products : products.slice(0, 4);

  if (loading) {
    return (
      <section className="w-full py-16 bg-white">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            TRENDING NOW
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
          TRENDING NOW
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          What's hot right now in fashion
        </p>
      </div>

      {/* Products Container */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedProducts.map((product) => (
            <div
              key={product._id}
              className="group cursor-pointer bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    -{product.discount}% OFF
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                {/* Style and Gender */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{product.style || "Casual"}</span>
                  <span>•</span>
                  <span>{product.gender}</span>
                </div>

                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 line-clamp-2 text-left">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <RatingStar value={product.rating} readOnly size={16} />
                  <span className="text-sm font-medium text-gray-700">
                    {product.rating}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  {product.discount > 0 ? (
                    <>
                      <span className="font-bold text-lg text-gray-900">
                        $
                        {(product.price * (1 - product.discount / 100)).toFixed(
                          2
                        )}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ${product.price}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-lg text-gray-900">
                      ${product.price}
                    </span>
                  )}
                </div>

                {/* Size and Stock */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Size: {product.size}</span>
                  <span
                    className={
                      product.stockAvailable > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {product.stockAvailable > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
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
                ? "Shop All Trending Items"
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
