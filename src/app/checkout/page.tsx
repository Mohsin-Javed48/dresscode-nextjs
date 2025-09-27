"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getOrCreateGuestId,
  createOrder,
  CreateOrderRequest,
  formatCurrency,
} from "@/app/_lib/ordersClient";
import { fetchCart } from "@/app/_lib/cartClient";

import {
  CreditCard,
  MapPin,
  Package,
  Lock,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    method: "credit_card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  const [pricing, setPricing] = useState({
    shippingCost: 10.0,
    discount: 0,
  });

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const userId = getOrCreateGuestId();
      const response = await fetchCart(userId);
      setCart(response.cart);

      // Calculate tax (8.5% of subtotal)
      const subtotal =
        response.cart.items?.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        ) || 0;
      setPricing((prev) => ({
        ...prev,
      }));
    } catch (err) {
      setError("Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("shipping.")) {
      const field = name.split(".")[1];
      setShippingAddress((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else if (name.startsWith("payment.")) {
      const field = name.split(".")[1];
      setPaymentInfo((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart?.items?.length) {
      setError("Your cart is empty");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const orderData: CreateOrderRequest = {
        items: cart.items.map((item: any) => ({
          product: item.productId,
          quantity: item.quantity,
          size: item.size || "M",
        })),
        shippingAddress,
        paymentInfo: {
          method: paymentInfo.method,
          transactionId: `txn_${Date.now()}`,
        },
        pricing,
        notes: "",
      };

      const response = await createOrder(orderData);
      setOrderNumber(response.order.orderNumber);
      setSuccess(true);

      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        router.push("/orders");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              <span className="text-gray-600">Loading checkout...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Your order #{orderNumber} has been confirmed.
            </p>
            <p className="text-gray-500 mb-8">
              You will receive an email confirmation shortly. Redirecting to
              orders page...
            </p>
            <Link
              href="/orders"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Add some items to your cart before proceeding to checkout.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal =
    cart.items?.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    ) || 0;
  const total =
    subtotal + pricing.shippingCost - pricing.discount;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/cart"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Cart
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Forms */}
            <div className="space-y-8">
              {/* Shipping Address */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Shipping Address
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="shipping.firstName"
                      value={shippingAddress.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="shipping.lastName"
                      value={shippingAddress.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="shipping.email"
                      value={shippingAddress.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="shipping.phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      name="shipping.country"
                      value={shippingAddress.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="shipping.address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="shipping.city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="shipping.state"
                      value={shippingAddress.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="shipping.zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Payment Information
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method
                    </label>
                    <select
                      name="payment.method"
                      value={paymentInfo.method}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="credit_card">Cash on Delivery</option>
                      {/* <option value="debit_card">Debit Card</option>
                      <option value="paypal">PayPal</option>
                      <option value="stripe">Stripe</option> */}
                    </select>
                  </div>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      name="payment.cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        name="payment.expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV *
                      </label>
                      <input
                        type="text"
                        name="payment.cvv"
                        value={paymentInfo.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      name="payment.cardName"
                      value={paymentInfo.cardName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div> */}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Package className="h-5 w-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Order Summary
                  </h2>
                </div>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {cart.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Size: {item.size || "M"} • Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-gray-900">
                      {formatCurrency(pricing.shippingCost)}
                    </span>
                  </div>
                  {pricing.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-green-600">
                        -{formatCurrency(pricing.discount)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-base font-medium">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <Lock className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Secure Checkout
                    </h3>
                    <p className="mt-1 text-sm text-green-700">
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Place Order - {formatCurrency(total)}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
