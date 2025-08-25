import Image from "next/image";
import React from "react";

const products = [
  {
    id: 1,
    name: "Vertical Striped Shirt",
    rating: 5.0,
    reviews: "0 reviews",
    originalPrice: "$232",
    discountedPrice: "$212",
    discount: "20%",
    image: "/placeholder-shirt.jpg", // Replace with your image path in public folder
  },
  {
    id: 2,
    name: "Courage Graphic T-Shirt",
    rating: 4.0,
    reviews: "20 reviews",
    price: "$145",
    image: "/placeholder-tshirt.jpg", // Replace with your image path in public folder
  },
  {
    id: 3,
    name: "Loose Fit Bermuda Shorts",
    rating: 3.0,
    reviews: "50 reviews",
    price: "$80",
    image: "/placeholder-shorts.jpg", // Replace with your image path in public folder
  },
  {
    id: 4,
    name: "Faded Skinny Jeans",
    rating: 4.5,
    reviews: "100 reviews",
    price: "$310",
    image: "/placeholder-jeans.jpg", // Replace with your image path in public folder
  },
];

export default function page() {
  return (
    <div className="w-full h- flex flex-col justify-center items-center  py-16">
      <h1 className="text-5xl font-extrabold mb-4">NEW ARRIVALS</h1>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative w-full h-80">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <div className="flex items-center mt-2">
                  <div className="flex text-yellow-400">
                    {"★".repeat(Math.floor(product.rating)) +
                      "☆".repeat(5 - Math.floor(product.rating))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
                <div className="mt-2">
                  {product.discountedPrice ? (
                    <>
                      <span className="text-xl font-bold text-gray-900">
                        {product.discountedPrice}
                      </span>
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {product.originalPrice}
                      </span>
                      <span className="ml-2 text-sm text-red-500">
                        {product.discount}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-gray-900">
                      {product.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-full hover:bg-gray-300 transition duration-300">
            View All
          </button>
        </div>
      </div>
    </div>
  );
}
