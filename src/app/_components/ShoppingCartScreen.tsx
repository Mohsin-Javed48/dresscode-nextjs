"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, Tag } from "lucide-react";

export default function ShoppingCart() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Gradient Graphic T-shirt",
      size: "Large",
      color: "White",
      price: 145,
      quantity: 1,
      image: "/api/placeholder/80/80",
    },
    {
      id: 2,
      name: "Checkered Shirt",
      size: "Medium",
      color: "Red",
      price: 180,
      quantity: 1,
      image: "/api/placeholder/80/80",
    },
    {
      id: 3,
      name: "Skinny Fit Jeans",
      size: "Large",
      color: "Blue",
      price: 240,
      quantity: 1,
      image: "/api/placeholder/80/80",
    },
  ]);

  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = (id, change) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = Math.round(subtotal * 0.2);
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile and Desktop Container */}
      <div className="max-w-md mx-auto lg:max-w-6xl">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center gap-2 lg:px-8 lg:py-6">
          <span className="text-gray-500 text-sm lg:text-base">Home</span>
          <ChevronRight className="w-6 h-6 text-gray-600" />
          <span className="text-gray-500 text-sm lg:text-base">Cart</span>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:px-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="px-4 py-6 lg:px-0">
              <h1 className="text-2xl lg:text-4xl font-bold text-black mb-6">
                YOUR CART
              </h1>

              {/* Cart Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-lg flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-lg flex items-center justify-center">
                          <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm lg:text-base leading-tight">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-600 ml-2 flex-shrink-0"
                          >
                            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium">×</span>
                            </div>
                          </button>
                        </div>

                        <div className="text-xs lg:text-sm text-gray-600 space-y-1 mb-3 text-left">
                          <div>
                            Size:{" "}
                            <span className="text-gray-800">{item.size}</span>
                          </div>
                          <div>
                            Color:{" "}
                            <span className="text-gray-800">{item.color}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg lg:text-xl text-gray-900">
                            ${item.price}
                          </span>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-medium text-sm w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar for Desktop */}
          <div className="lg:col-span-1 lg:pt-20">
            {/* Order Summary */}
            <div className="bg-white mx-4 lg:mx-0 rounded-t-3xl lg:rounded-2xl px-6 py-6 shadow-sm">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal}</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Discount (-20%)</span>
                  <span className="font-medium">-${discount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium">${deliveryFee}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg lg:text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Add promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <button className="px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-gray-900 text-white py-4 rounded-full font-medium text-base lg:text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                Go to Checkout
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
