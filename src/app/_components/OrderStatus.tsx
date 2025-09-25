"use client";

import {
  getOrderStatusColor,
  getOrderStatusText,
} from "@/app/_lib/ordersClient";

interface OrderStatusProps {
  status: string;
  className?: string;
}

export default function OrderStatus({
  status,
  className = "",
}: OrderStatusProps) {
  const colorClasses = getOrderStatusColor(status);
  const statusText = getOrderStatusText(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses} ${className}`}
    >
      {statusText}
    </span>
  );
}
