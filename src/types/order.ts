import {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ShippingAddress,
  OrderPricing,
} from "./index";

// ============================================================================
// ORDER API TYPES
// ============================================================================

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface OrderListResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface OrderDetailResponse {
  order: Order;
  trackingInfo?: TrackingInfo;
  estimatedDelivery?: Date;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: {
    method: PaymentMethod;
    transactionId?: string;
  };
  notes?: string;
}

// ============================================================================
// ORDER COMPONENT TYPES
// ============================================================================

export interface OrderCardProps {
  order: Order;
  onViewDetails?: (order: Order) => void;
  onTrackOrder?: (order: Order) => void;
  onCancelOrder?: (order: Order) => void;
  onReorder?: (order: Order) => void;
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

export interface OrderListProps {
  orders: Order[];
  loading?: boolean;
  onOrderClick?: (order: Order) => void;
  onStatusFilter?: (status: OrderStatus) => void;
  className?: string;
}

export interface OrderStatusProps {
  status: OrderStatus;
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
}

export interface OrderFiltersProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  onClearFilters: () => void;
  className?: string;
}

// ============================================================================
// ORDER FORM TYPES
// ============================================================================

export interface OrderFormData {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
  agreeToTerms: boolean;
}

export interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

export interface ShippingAddressFormProps {
  address: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
  errors?: Record<string, string>;
  className?: string;
}

export interface PaymentMethodFormProps {
  method: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  className?: string;
}

// ============================================================================
// ORDER TRACKING TYPES
// ============================================================================

export interface TrackingInfo {
  trackingNumber: string;
  carrier: string;
  status: string;
  location: string;
  estimatedDelivery: Date;
  history: TrackingEvent[];
}

export interface TrackingEvent {
  status: string;
  location: string;
  timestamp: Date;
  description: string;
}

export interface OrderTrackingProps {
  order: Order;
  trackingInfo?: TrackingInfo;
  className?: string;
}

// ============================================================================
// ORDER FILTERS TYPES
// ============================================================================

export interface OrderFilters {
  status?: OrderStatus[];
  paymentMethod?: PaymentMethod[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  search?: string;
}

export interface OrderSortOptions {
  field: "createdAt" | "total" | "status" | "orderNumber";
  order: "asc" | "desc";
}

// ============================================================================
// ORDER STATE TYPES
// ============================================================================

export interface OrderState {
  orders: Order[];
  currentOrder?: Order;
  loading: boolean;
  error?: string;
  filters: OrderFilters;
  sort: OrderSortOptions;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderActions {
  fetchOrders: (params?: OrderListParams) => Promise<void>;
  fetchOrder: (orderId: string) => Promise<void>;
  createOrder: (data: CreateOrderRequest) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  setFilters: (filters: OrderFilters) => void;
  setSort: (sort: OrderSortOptions) => void;
  setPage: (page: number) => void;
}

export interface OrderContextType extends OrderState, OrderActions {}

// ============================================================================
// ORDER ANALYTICS TYPES
// ============================================================================

export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
  revenueByStatus: Record<OrderStatus, number>;
  ordersByMonth: Array<{
    month: string;
    count: number;
    revenue: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
}

export interface OrderStatsProps {
  analytics: OrderAnalytics;
  className?: string;
}

// ============================================================================
// ORDER NOTIFICATION TYPES
// ============================================================================

export interface OrderNotification {
  id: string;
  orderId: string;
  type: "status_update" | "shipped" | "delivered" | "cancelled";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface OrderNotificationProps {
  notification: OrderNotification;
  onMarkAsRead: (id: string) => void;
  onViewOrder: (orderId: string) => void;
  className?: string;
}

// ============================================================================
// ORDER EXPORT TYPES
// ============================================================================

export interface OrderExportOptions {
  format: "csv" | "excel" | "pdf";
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: OrderStatus[];
  includeItems?: boolean;
  includeAddress?: boolean;
}

export interface OrderExportProps {
  orders: Order[];
  onExport: (options: OrderExportOptions) => void;
  className?: string;
}

// ============================================================================
// ORDER REFUND TYPES
// ============================================================================

export interface RefundRequest {
  orderId: string;
  items: Array<{
    itemId: string;
    quantity: number;
    reason: string;
  }>;
  reason: string;
  amount: number;
}

export interface RefundProps {
  order: Order;
  onRequestRefund: (request: RefundRequest) => void;
  className?: string;
}

// ============================================================================
// ORDER REVIEW TYPES
// ============================================================================

export interface OrderReviewProps {
  order: Order;
  onReviewProduct: (productId: string) => void;
  onReviewOrder: () => void;
  className?: string;
}
