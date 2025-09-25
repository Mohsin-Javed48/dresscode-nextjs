import { clearCart } from "./cartClient";

export type OrderItem = {
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
    category: string;
  };
  quantity: number;
  size: string;
  price: number;
  totalPrice: number;
};

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type PaymentInfo = {
  method:
    | "credit_card"
    | "debit_card"
    | "paypal"
    | "stripe"
    | "cash_on_delivery";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  paidAt?: string;
};

export type OrderPricing = {
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
};

export type Order = {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  pricing: OrderPricing;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  notes?: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateOrderRequest = {
  items: {
    product: string;
    quantity: number;
    size: string;
  }[];
  shippingAddress: ShippingAddress;
  paymentInfo: {
    method: string;
    transactionId?: string;
  };
  pricing: {
    shippingCost: number;
    tax: number;
    discount: number;
  };
  notes?: string;
};

export type OrderStats = {
  totalOrders: number;
  totalRevenue: number;
  statusBreakdown: {
    status: string;
    count: number;
    revenue: number;
  }[];
};

export type PaginationInfo = {
  current: number;
  pages: number;
  total: number;
};

export type OrdersResponse = {
  orders: Order[];
  pagination: PaginationInfo;
};

export type OrderStatsResponse = {
  stats: OrderStats;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "dresscode_guest_id";
  const userRaw = localStorage.getItem("user");
  try {
    if (userRaw) {
      const parsed = JSON.parse(userRaw);
      if (parsed?.id && typeof parsed.id === "string") {
        return parsed.id as string;
      }
    }
  } catch {
    // ignore malformed user storage
  }

  let gid = localStorage.getItem(KEY);
  if (!gid) {
    const gen =
      globalThis.crypto && "randomUUID" in globalThis.crypto
        ? (globalThis.crypto as Crypto).randomUUID()
        : `${Date.now()}-${Math.random()}`;
    gid = gen;
    localStorage.setItem(KEY, gid);
  }
  return gid;
}

export async function createOrder(
  orderData: CreateOrderRequest,
  userId?: string
): Promise<{ order: Order }> {
  const userIdToUse = userId || getOrCreateGuestId();

  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...orderData,
      userId: userIdToUse,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create order");
  }

  clearCart(userIdToUse);

  return res.json();
}

export async function fetchUserOrders(
  userId?: string,
  options: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<OrdersResponse> {
  const userIdToUse = userId || getOrCreateGuestId();
  const { status, page = 1, limit = 10 } = options;

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) {
    params.append("status", status);
  }

  const res = await fetch(
    `${API_BASE}/api/orders/user/${userIdToUse}?${params}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch orders");
  }

  return res.json();
}

export async function fetchOrderById(
  orderId: string
): Promise<{ order: Order }> {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch order");
  }

  return res.json();
}

export async function fetchOrderByNumber(
  orderNumber: string
): Promise<{ order: Order }> {
  const res = await fetch(`${API_BASE}/api/orders/number/${orderNumber}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch order");
  }

  return res.json();
}

export async function cancelOrder(
  orderId: string,
  reason?: string
): Promise<{ order: Order }> {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/cancel`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to cancel order");
  }

  return res.json();
}

export async function searchOrders(
  query: string,
  options: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<OrdersResponse> {
  const { status, page = 1, limit = 10 } = options;

  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) {
    params.append("status", status);
  }

  const res = await fetch(`${API_BASE}/api/orders/search/query?${params}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to search orders");
  }

  return res.json();
}

export async function fetchOrderStats(
  startDate?: string,
  endDate?: string
): Promise<OrderStatsResponse> {
  const params = new URLSearchParams();

  if (startDate) {
    params.append("startDate", startDate);
  }

  if (endDate) {
    params.append("endDate", endDate);
  }

  const res = await fetch(`${API_BASE}/api/orders/stats/overview?${params}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch order statistics");
  }

  return res.json();
}

export function getOrderStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-purple-100 text-purple-800";
    case "shipped":
      return "bg-indigo-100 text-indigo-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "returned":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getOrderStatusText(status: string): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    case "returned":
      return "Returned";
    default:
      return status;
  }
}

export function formatOrderDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
