"use client";

import {
  Order,
  formatOrderDate,
  formatCurrency,
} from "@/app/_lib/ordersClient";
import OrderStatus from "./OrderStatus";
import { Package, Calendar, DollarSign, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  showActions?: boolean;
}

export default function OrderCard({
  order,
  onViewDetails,
  showActions = true,
}: OrderCardProps) {
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(order._id);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Package className="h-5 w-5 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order.orderNumber}
              </h3>
              <p className="text-sm text-gray-500">
                Placed on {formatOrderDate(order.created_at)}
              </p>
            </div>
          </div>
          <div className="mt-2 sm:mt-0">
            <OrderStatus status={order.status} />
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="mb-4">
          <div className="flex space-x-3">
            {order.items.slice(0, 3).map((item, index) => (
              <div key={index} className="relative">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                {item.quantity > 1 && (
                  <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.quantity}
                  </span>
                )}
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="flex items-center justify-center w-15 h-15 bg-gray-100 rounded-md text-sm font-medium text-gray-600">
                +{order.items.length - 3}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""} •
            Size: {order.items[0]?.size}
          </p>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Order Date</p>
              <p className="text-sm font-medium text-gray-900">
                {formatOrderDate(order.created_at)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Total Amount</p>
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(order.pricing.total)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Items</p>
              <p className="text-sm font-medium text-gray-900">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
            <Link
              href={`/orders/${order._id}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Link>
            {order.status === "pending" && (
              <button className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
                Cancel Order
              </button>
            )}
            {order.status === "delivered" && (
              <button className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                Reorder
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
