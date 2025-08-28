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
    image: "/pure-black-tshirt.jpg",
  },
  {
    id: 2,
    name: "Courage Graphic T-Shirt",
    rating: 4.0,
    reviews: "20 reviews",
    price: "$145",
    image: "/frock-image.jpg",
  },
  {
    id: 3,
    name: "Loose Fit Bermuda Shorts",
    rating: 3.0,
    reviews: "50 reviews",
    price: "$80",
    image: "/pexels-rozegold.jpg",
  },
  {
    id: 4,
    name: "Faded Skinny Jeans",
    rating: 4.5,
    reviews: "100 reviews",
    price: "$310",
    image: "/blue-baby-boy-shirt.jpg",
  },
];

export default function Page() {
  return (
    <section className="w-full flex flex-col justify-center items-center py-8 sm:py-12 lg:py-16 bg-gray-50">
      {/* Section Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 sm:mb-8 lg:mb-12 text-center px-4">
        YOU MIGHT ALSO LIKE
      </h1>

      {/* Products Container */}
      <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
          {products.map((product) => (
            <article
              key={product.id}
              className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 group overflow-hidden"
            >
              {/* Product Image with Aspect Ratio */}
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />

                {/* Discount Badge */}
                {product.discount && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded-full">
                    -{product.discount}
                  </span>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4 sm:p-5">
                {/* Product Name */}
                <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-black transition-colors duration-200">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center mb-2 gap-1">
                  <div className="flex text-yellow-400 text-sm sm:text-base">
                    {"★".repeat(Math.floor(product.rating)) +
                      "☆".repeat(5 - Math.floor(product.rating))}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {product.rating}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex flex-wrap items-center gap-2">
                  {product.discountedPrice ? (
                    <>
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                        {product.discountedPrice}
                      </span>
                      <span className="text-sm sm:text-base text-gray-500 line-through">
                        {product.originalPrice}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {product.price}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
      </div>
    </section>
  );
}
