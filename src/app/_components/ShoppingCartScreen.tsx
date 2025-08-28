"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  Menu,
  Minus,
  Plus,
  ArrowRight,
  Trash2,
  ShoppingCart as ShoppingCartIcon, // ✅ Add this
} from "lucide-react";

// Types
interface CartItem {
  id: number;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderSummary {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
}

// Product Image Component
function ProductImage({
  type,
  className = "",
}: {
  type: string;
  className?: string;
}) {
  const baseClasses = `flex items-center justify-center rounded-lg ${className}`;

  switch (type) {
    case "gradient-tshirt":
      return (
        <div className={`${baseClasses} bg-pink-100`}>
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-pink-300 to-purple-300 rounded" />
        </div>
      );
    case "checkered-shirt":
      return (
        <div className={`${baseClasses} bg-red-900`}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-800 rounded grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-sm opacity-30" />
            ))}
          </div>
        </div>
      );
    case "skinny-jeans":
      return (
        <div className={`${baseClasses} bg-blue-800`}>
          <div className="w-8 h-10 sm:w-10 sm:h-12 bg-blue-700 rounded-b-lg" />
        </div>
      );
    default:
      return (
        <div className={`${baseClasses} bg-gray-200`}>
          <div className="w-8 h-8 bg-gray-400 rounded" />
        </div>
      );
  }
}

// Cart Item Component
function CartItemComponent({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: {
  item: CartItem;
  onUpdateQuantity: (id: number, change: number) => void;
  onRemoveItem: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0 self-center sm:self-start">
          <ProductImage
            type={item.image}
            className="w-16 h-16 sm:w-20 sm:h-20"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base sm:text-lg truncate pr-2">
                {item.name}
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500 mt-1">
                <span>Size: {item.size}</span>
                <span>Color: {item.color}</span>
              </div>
              <p className="text-lg sm:text-xl font-bold mt-2">${item.price}</p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => onRemoveItem(item.id)}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors duration-200 flex-shrink-0 group"
              aria-label={`Remove ${item.name} from cart`}
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 group-hover:text-red-600" />
            </button>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center bg-gray-100 rounded-full">
              <button
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={item.quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <span className="px-3 sm:px-4 font-medium text-sm sm:text-base min-w-[2rem] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Order Summary Component
function OrderSummaryComponent({
  summary,
  onCheckout,
}: {
  summary: OrderSummary;
  onCheckout: () => void;
}) {
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
      setShowPromoInput(false);
      // In a real app, you'd validate the promo code here
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 sticky top-24">
      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
        Order Summary
      </h3>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between text-sm sm:text-base">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">${summary.subtotal}</span>
        </div>

        <div className="flex justify-between text-sm sm:text-base">
          <span className="text-gray-600">Discount (-20%)</span>
          <span className="font-semibold text-red-500">
            -${summary.discount}
          </span>
        </div>

        <div className="flex justify-between text-sm sm:text-base">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-semibold">${summary.deliveryFee}</span>
        </div>

        <hr className="border-gray-200" />

        <div className="flex justify-between text-lg sm:text-xl font-bold">
          <span>Total</span>
          <span>${summary.total}</span>
        </div>
      </div>

      {/* Promo Code Section */}
      <div className="mt-4 sm:mt-6">
        {!showPromoInput && !promoApplied ? (
          <button
            onClick={() => setShowPromoInput(true)}
            className="flex items-center text-gray-600 text-sm hover:text-gray-800 transition-colors duration-200"
          >
            <span className="mr-2">🏷</span>
            Add promo code
          </button>
        ) : promoApplied ? (
          <div className="flex items-center text-green-600 text-sm">
            <span className="mr-2">🏷</span>
            Promo code applied
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                onKeyPress={(e) => e.key === "Enter" && handleApplyPromo()}
              />
              <button
                onClick={handleApplyPromo}
                className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
              >
                Apply
              </button>
            </div>
            <button
              onClick={() => setShowPromoInput(false)}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className="w-full bg-black text-white py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg mt-4 sm:mt-6 flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors duration-200 active:scale-98 transform"
      >
        <span>Go to Checkout</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}

// Main Shopping Cart Component
function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Gradient Graphic T-shirt",
      size: "Large",
      color: "White",
      price: 145,
      quantity: 1,
      image: "gradient-tshirt",
    },
    {
      id: 2,
      name: "Checkered Shirt",
      size: "Medium",
      color: "Red",
      price: 180,
      quantity: 1,
      image: "checkered-shirt",
    },
    {
      id: 3,
      name: "Skinny Fit Jeans",
      size: "Large",
      color: "Blue",
      price: 240,
      quantity: 1,
      image: "skinny-jeans",
    },
  ]);

  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    subtotal: 0,
    discount: 0,
    deliveryFee: 0,
    total: 0,
  });

  // Calculate order summary
  useEffect(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = Math.round(subtotal * 0.2);
    const deliveryFee = cartItems.length > 0 ? 15 : 0;
    const total = subtotal - discount + deliveryFee;

    setOrderSummary({ subtotal, discount, deliveryFee, total });
  }, [cartItems]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      alert("Proceeding to checkout...");
      // In a real app, navigate to checkout page
    } else {
      alert("Your cart is empty!");
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-white lg:bg-gray-50">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8 py-3 text-sm text-gray-500 bg-white lg:bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <button className="hover:text-gray-700 transition-colors duration-200">
            Home
          </button>
          <span className="mx-2">›</span>
          <span className="text-black font-medium">Cart</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-8">
            YOUR CART
          </h2>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-4">
                Add some items to get started
              </p>
              <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200">
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                {cartItems.map((item) => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                  />
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-8 lg:mt-0">
                <OrderSummaryComponent
                  summary={orderSummary}
                  onCheckout={handleCheckout}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
