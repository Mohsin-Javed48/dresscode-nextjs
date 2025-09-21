"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { RatingStar } from "@/app/_components/RatingStar";
import Image from "next/image";
import { ShoppingCart, Heart, ArrowLeft } from "lucide-react";

interface Product {
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

// Function to fetch single product from MongoDB API
async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`http://localhost:8000/api/cloths/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (params.shopId) {
        setLoading(true);
        try {
          const fetchedProduct = await getProduct(params.shopId as string);
          setProduct(fetchedProduct);
        } catch (error) {
          console.error("Error loading product:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchProduct();
  }, [params.shopId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h1>
        <button
          onClick={() => router.back()}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const discountedPrice =
    product.discount > 0
      ? (product.price * (1 - product.discount / 100)).toFixed(2)
      : product.price;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square bg-white rounded-2xl overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                -{product.discount}% OFF
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>{product.style}</span>
                <span>•</span>
                <span>{product.gender}</span>
                <span>•</span>
                <span>{product.category}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <RatingStar value={product.rating} readOnly size={20} />
              <span className="text-lg font-medium text-gray-700">
                {product.rating}
              </span>
              <span className="text-gray-500">({product.reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">
                Rs {discountedPrice}
              </span>
              {product.discount > 0 && (
                <span className="text-xl text-gray-500 line-through">
                  Rs {product.price}
                </span>
              )}
            </div>

            {/* Size */}
            {product.size && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Size
                </h3>
                <div className="flex gap-2">
                  <div className="px-4 py-2 border border-black bg-black text-white rounded-lg font-medium">
                    {product.size}
                  </div>
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.stockAvailable > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span
                className={`font-medium ${
                  product.stockAvailable > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stockAvailable > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                disabled={product.stockAvailable === 0}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-lg border transition-colors ${
                  isWishlisted
                    ? "bg-red-500 text-white border-red-500"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Product Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Season:</span>
                  <span className="ml-2 font-medium">{product.season}</span>
                </div>
                <div>
                  <span className="text-gray-500">Stock:</span>
                  <span className="ml-2 font-medium">
                    {product.stockAvailable} available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
