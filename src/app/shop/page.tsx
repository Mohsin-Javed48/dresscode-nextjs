"use client";

import React, { useState } from "react";
import { ShoppingCart, Search, Star, Heart } from "lucide-react";
import Image from "next/image";

// Sample product data
const productData = {
  topSelling: [
    {
      id: 1,
      name: "Classic Denim Jacket",
      price: 89,
      originalPrice: 120,
      rating: 4.8,
      reviews: 124,
      description:
        "Premium quality denim jacket perfect for any casual occasion. Comfortable fit with durable construction.",
      badge: "Hot",
      image:
        "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=500&fit=crop",
    },
    {
      id: 2,
      name: "Vintage Graphic Tee",
      price: 35,
      originalPrice: 50,
      rating: 4.6,
      reviews: 89,
      description:
        "Soft cotton graphic tee with vintage-inspired design. Perfect for everyday wear.",
      badge: "Hot",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    },
    {
      id: 3,
      name: "Premium Hoodie",
      price: 75,
      originalPrice: 95,
      rating: 4.9,
      reviews: 156,
      description:
        "Ultra-comfortable premium hoodie with fleece lining. Perfect for cool weather.",
      badge: "Hot",
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
    },
    {
      id: 4,
      name: "Slim Fit Chinos",
      price: 65,
      originalPrice: 85,
      rating: 4.5,
      reviews: 78,
      description:
        "Tailored slim-fit chinos in premium cotton blend. Versatile for casual or smart-casual looks.",
      badge: "Hot",
      image:
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
    },
  ],
  newArrivals: [
    {
      id: 5,
      name: "Oversized Blazer",
      price: 120,
      rating: 4.7,
      reviews: 23,
      description:
        "Modern oversized blazer with structured shoulders. Perfect for professional or casual styling.",
      badge: "New",
      image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    },
    {
      id: 6,
      name: "Cropped Sweater",
      price: 58,
      rating: 4.8,
      reviews: 15,
      description:
        "Cozy cropped sweater in soft merino wool blend. Trendy and comfortable for layering.",
      badge: "New",
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop",
    },
    {
      id: 7,
      name: "Wide Leg Jeans",
      price: 95,
      rating: 4.6,
      reviews: 31,
      description:
        "Trending wide-leg jeans in premium denim. Comfortable fit with a modern silhouette.",
      badge: "New",
      image:
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop",
    },
    {
      id: 8,
      name: "Silk Camisole",
      price: 68,
      rating: 4.9,
      reviews: 12,
      description:
        "Luxurious silk camisole with delicate lace trim. Perfect for layering or wearing alone.",
      badge: "New",
      image:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop",
    },
  ],
  featured: [
    {
      id: 9,
      name: "Leather Jacket",
      price: 189,
      rating: 4.9,
      reviews: 67,
      description:
        "Genuine leather jacket with classic biker styling. Durable construction and timeless appeal.",
      badge: "Featured",
      image:
        "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400&h=500&fit=crop",
    },
    {
      id: 10,
      name: "Cashmere Scarf",
      price: 145,
      rating: 4.8,
      reviews: 43,
      description:
        "Luxurious 100% cashmere scarf in classic pattern. Soft, warm, and incredibly stylish.",
      badge: "Featured",
      image:
        "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=400&h=500&fit=crop",
    },
    {
      id: 11,
      name: "Designer Dress",
      price: 225,
      rating: 4.7,
      reviews: 29,
      description:
        "Elegant midi dress in premium fabric. Perfect for special occasions and evening events.",
      badge: "Featured",
      image:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
    },
    {
      id: 12,
      name: "Tailored Suit",
      price: 320,
      rating: 4.9,
      reviews: 18,
      description:
        "Expertly tailored two-piece suit in premium wool. Professional and sophisticated styling.",
      badge: "Featured",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
    },
  ],
  trending: [
    {
      id: 13,
      name: "Bucket Hat",
      price: 28,
      rating: 4.5,
      reviews: 92,
      description:
        "Trendy bucket hat in cotton canvas. Perfect summer accessory with UV protection.",
      badge: "Trending",
      image:
        "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=500&fit=crop",
    },
    {
      id: 14,
      name: "Cargo Pants",
      price: 78,
      rating: 4.4,
      reviews: 56,
      description:
        "Utility-inspired cargo pants with multiple pockets. Comfortable and functional streetwear.",
      badge: "Trending",
      image:
        "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop",
    },
    {
      id: 15,
      name: "Platform Sneakers",
      price: 95,
      rating: 4.6,
      reviews: 73,
      description:
        "Chunky platform sneakers with retro styling. Comfortable and on-trend footwear option.",
      badge: "Trending",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
    },
    {
      id: 16,
      name: "Shacket",
      price: 68,
      rating: 4.8,
      reviews: 41,
      description:
        "Shirt-jacket hybrid in soft flannel. Perfect layering piece for transitional seasons.",
      badge: "Trending",
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop",
    },
  ],
};

const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
}) => {
  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Hot":
        return "bg-red-500";
      case "New":
        return "bg-teal-500";
      case "Featured":
        return "bg-yellow-400 text-black";
      case "Trending":
        return "bg-pink-400";
      default:
        return "bg-gray-500";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      <div className="relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          width={400}
          height={300}
          style={{ objectFit: "cover" }}
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getBadgeColor(
              product.badge
            )}`}
          >
            {product.badge}
          </span>
        </div>
        <button
          onClick={() => onToggleWishlist(product.id)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white text-gray-400 hover:text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
        </button>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-gray-900">
            Rs {product.price}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-gray-500 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">{renderStars(product.rating)}</div>
          <span className="text-sm text-gray-600">
            {product.rating}/5 ({product.reviews} reviews)
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
          {product.description}
        </p>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-black text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
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
  onViewAll,
}) => (
  <section className="mb-20">
    <div className="mb-12">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 relative inline-block">
        {title}
        <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl">{subtitle}</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isWishlisted={wishlist.includes(product.id)}
        />
      ))}
    </div>

    <div className="text-left">
      <button
        onClick={() => onViewAll(title)}
        className="px-8 py-4 border-2 border-black text-black font-semibold rounded-full hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105"
      >
        View All {title}
      </button>
    </div>
  </section>
);

export default function ProductCategoriesPage() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [email, setEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
    // Show success message or animation
    alert(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleViewAll = (category) => {
    alert(`Viewing all ${category} products...`);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert("Thank you for subscribing to our newsletter!");
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen  flex flex-col pl-4  bg-gray-50">
      {/* Main Content */}
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Selling */}
        <CategorySection
          title="Top Selling"
          subtitle="Our most popular items that customers love"
          products={productData.topSelling}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlist={wishlist}
          onViewAll={handleViewAll}
        />

        {/* New Arrivals */}
        <CategorySection
          title="New Arrivals"
          subtitle="Fresh styles just landed in our collection"
          products={productData.newArrivals}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlist={wishlist}
          onViewAll={handleViewAll}
        />

        {/* Featured Collection */}
        <CategorySection
          title="Featured Collection"
          subtitle="Curated pieces from our premium selection"
          products={productData.featured}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlist={wishlist}
          onViewAll={handleViewAll}
        />

        {/* Trending Now */}
        <CategorySection
          title="Trending Now"
          subtitle="What's hot right now in fashion"
          products={productData.trending}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          wishlist={wishlist}
          onViewAll={handleViewAll}
        />
      </main>
    </div>
  );
}
