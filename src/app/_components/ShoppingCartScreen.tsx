"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  Minus,
  Plus,
  Tag,
  Truck,
  Trash2,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  fetchCart as apiFetchCart,
  updateQuantity as apiUpdateQty,
  removeItem as apiRemoveItem,
  clearCart as apiClearCart,
  getOrCreateGuestId,
  fetchCart,
} from "@/app/_lib/cartClient";

type CartItem = {
  productId: string;
  name: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
  image?: string;
};

type BackendCartItem = {
  productId: unknown;
  name: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
  image?: string;
};

const shippingOptions = [
  { id: "standard", label: "Standard (3-5 days)", fee: 15 },
  { id: "express", label: "Express (1-2 days)", fee: 30 },
  { id: "pickup", label: "Store Pickup", fee: 0 },
] as const;

export default function ShoppingCart() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoMessage, setPromoMessage] = useState<string>("");
  const [shippingMethod] = useState("standard");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  // Load cart from backend
  useEffect(() => {
    const run = async () => {
      try {
        const gid = getOrCreateGuestId();
        setUserId(gid);
        const { cart } = await fetchCart(gid);
        console.log(cart);
        const mapped: CartItem[] = (cart.items || []).map(
          (i: BackendCartItem) => ({
            productId: String(i.productId),
            name: i.name,
            size: i.size,
            color: i.color,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })
        );
        console.log(mapped);
        setItems(mapped);
      } catch {
        // keep empty cart
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const updateQuantity = async (
    productId: string,
    size: string | undefined,
    color: string | undefined,
    newQty: number
  ) => {
    if (!userId) return;
    const nextQty = Math.max(1, newQty);
    try {
      const { cart } = await apiUpdateQty(userId, productId, {
        size,
        color,
        quantity: nextQty,
      });
      const mapped: CartItem[] = (cart.items || []).map(
        (i: BackendCartItem) => ({
          productId: String(i.productId),
          name: i.name,
          size: i.size,
          color: i.color,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })
      );
      setItems(mapped);
    } catch {
      // ignore
    }
  };

  const removeItem = async (
    productId: string,
    size?: string,
    color?: string
  ) => {
    if (!userId) return;
    try {
      const { cart } = await apiRemoveItem(userId, productId, { size, color });
      const mapped: CartItem[] = (cart.items || []).map(
        (i: BackendCartItem) => ({
          productId: String(i.productId),
          name: i.name,
          size: i.size,
          color: i.color,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })
      );
      setItems(mapped);
    } catch {
      // ignore
    }
  };

  const clearCart = async () => {
    if (!userId) return;
    try {
      await apiClearCart(userId);
      setItems([]);
    } catch {
      setItems([]);
    }
  };

  const shippingFee = useMemo(() => {
    const found = shippingOptions.find((s) => s.id === shippingMethod);
    return found ? found.fee : 15;
  }, [shippingMethod]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  // Promo logic
  const computePromoDiscount = useMemo(() => {
    const code = (appliedPromo || "").toUpperCase();
    if (!code) return 0;
    if (code === "SAVE10") return Math.round(subtotal * 0.1);
    if (code === "SAVE20") return Math.round(subtotal * 0.2);
    if (code === "FLAT50") return subtotal >= 200 ? 50 : 0;
    return 0;
  }, [appliedPromo, subtotal]);

  const computeShippingAdjustment = useMemo(() => {
    const code = (appliedPromo || "").toUpperCase();
    if (!code) return 0;
    if (code === "FREESHIP") return -shippingFee;
    return 0;
  }, [appliedPromo, shippingFee]);

  const tax = Math.round((subtotal - computePromoDiscount) * 0.08);
  const total = Math.max(
    0,
    subtotal -
      computePromoDiscount +
      shippingFee +
      computeShippingAdjustment +
      tax
  );

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    const valid = ["SAVE10", "SAVE20", "FLAT50", "FREESHIP"];
    if (!code) {
      setPromoMessage("Enter a code to apply");
      return;
    }
    if (!valid.includes(code)) {
      setPromoMessage("Invalid code. Try SAVE10, SAVE20, FLAT50, or FREESHIP");
      return;
    }
    setAppliedPromo(code);
    setPromoMessage("Promo applied successfully");
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoMessage("");
    setPromoCode("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto lg:max-w-6xl">
        {/* Breadcrumb */}
        <div className="bg-white px-4 py-4 flex items-center gap-2 lg:px-8 lg:py-6">
          <span className="text-gray-500 text-sm lg:text-base">Home</span>
          <ChevronRight className="w-6 h-6 text-gray-600" />
          <span className="text-gray-500 text-sm lg:text-base">Cart</span>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:px-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="px-4 py-6 lg:px-0">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl lg:text-4xl font-bold text-black">
                  YOUR CART
                </h1>
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Clear all
                  </button>
                )}
              </div>

              {loading ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
                </div>
              ) : items.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-7 h-7 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Add items to your cart to see them here.
                  </p>
                  <button
                    onClick={() => router.push("/shop")}
                    className="px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size || "_"}-${item.color || "_"}`}
                      className="bg-white rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-lg relative overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-lg" />
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm lg:text-base leading-tight">
                              {item.name}
                            </h3>
                            <button
                              onClick={() =>
                                removeItem(
                                  item.productId,
                                  item.size,
                                  item.color
                                )
                              }
                              className="text-red-500 hover:text-red-600 ml-2 flex-shrink-0 cursor-pointer"
                            >
                              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">×</span>
                              </div>
                            </button>
                          </div>

                          <div className="text-xs lg:text-sm text-gray-600 space-y-1 mb-3 text-left">
                            {item.size && (
                              <div>
                                Size:{" "}
                                <span className="text-gray-800">
                                  {item.size}
                                </span>
                              </div>
                            )}
                            {item.color && (
                              <div>
                                Color:{" "}
                                <span className="text-gray-800">
                                  {item.color}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="font-bold text-lg lg:text-xl text-gray-900">
                              ${item.price}
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.size,
                                    item.color,
                                    item.quantity - 1
                                  )
                                }
                                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 cursor-pointer"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-medium text-sm w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.size,
                                    item.color,
                                    item.quantity + 1
                                  )
                                }
                                className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 cursor-pointer"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Continue shopping CTA (mobile) */}
                  <div className="lg:hidden pt-2">
                    <button
                      onClick={() => router.push("/shop")}
                      className="w-full border border-gray-300 text-gray-900 py-3 rounded-full font-medium hover:bg-gray-50"
                      suppressHydrationWarning
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 lg:pt-20">
            <div className="bg-white mx-4 lg:mx-0 rounded-t-3xl lg:rounded-2xl px-6 py-6 shadow-sm">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Shipping Method */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                  <Truck className="w-4 h-4" /> Delivery
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal}</span>
                </div>
                {appliedPromo && computePromoDiscount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Promo ({appliedPromo})</span>
                    <span className="font-medium">
                      -${computePromoDiscount}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="font-medium">
                    ${Math.max(0, shippingFee + computeShippingAdjustment)}
                  </span>
                </div>

                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg lg:text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mb-4" suppressHydrationWarning>
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
                  {!appliedPromo ? (
                    <button
                      onClick={applyPromo}
                      className="px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                      suppressHydrationWarning
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      onClick={removePromo}
                      className="px-6 py-3 border border-gray-300 text-gray-900 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                      suppressHydrationWarning
                    >
                      Remove
                    </button>
                  )}
                </div>
                {promoMessage && (
                  <p className="text-xs text-gray-600 mt-2">{promoMessage}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push("/checkout")}
                  disabled={items.length === 0}
                  className="w-full bg-gray-900 text-white py-4 rounded-full font-medium text-base lg:text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Go to Checkout
                </button>
                <button
                  onClick={() => router.push("/shop")}
                  className="w-full border border-gray-300 text-gray-900 py-3 rounded-full font-medium hover:bg-gray-50"
                  suppressHydrationWarning
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
