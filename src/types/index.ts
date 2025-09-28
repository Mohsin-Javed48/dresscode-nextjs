// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: "customer" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Guest {
  id: string;
  email: string;
  fullName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthSession {
  user: User;
  expires: string;
}

// NextAuth specific types
export interface NextAuthUser {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export interface NextAuthSession {
  user: NextAuthUser;
  expires: string;
}

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export type ProductGender = "Men" | "Women" | "Unisex" | "Kids";
export type ProductSeason = "Summer" | "Winter" | "Spring" | "Autumn" | "All";
export type ProductCategory =
  | "shirts"
  | "pants"
  | "dresses"
  | "shoes"
  | "accessories"
  | "jackets"
  | "hoodies";

export interface Product {
  _id: string;
  name: string;
  title?: string; // Alternative name field
  rating: number;
  reviews: string | string[]; // Can be string or array of review IDs
  price: number;
  category: ProductCategory;
  style?: string;
  discount: number;
  image: string;
  size: ProductSize;
  season: ProductSeason;
  stockAvailable: number;
  description?: string;
  gender: ProductGender;
  color?: string;
  brand?: string;
  material?: string;
  careInstructions?: string;
  tags?: string[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFilters {
  category?: ProductCategory[];
  gender?: ProductGender[];
  size?: ProductSize[];
  season?: ProductSeason[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  inStock?: boolean;
  search?: string;
}

export interface ProductSortOptions {
  field: "price" | "rating" | "name" | "createdAt" | "discount";
  order: "asc" | "desc";
}

// ============================================================================
// REVIEW TYPES
// ============================================================================

export interface Review {
  _id: string;
  product: string | Product; // Product ID or populated Product
  email: string;
  userName: string;
  comment: string;
  rating: number; // 1-5
  isVerified?: boolean;
  helpful?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReviewFormData {
  productId: string;
  email: string;
  userName: string;
  comment: string;
  rating: number;
}

// ============================================================================
// CART TYPES
// ============================================================================

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  size?: string;
  color?: string;
  quantity: number;
}

export interface BackendCartItem {
  productId: unknown; // MongoDB ObjectId
  name: string;
  price: number;
  image?: string;
  size?: string;
  color?: string;
  quantity: number;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartUpdateData {
  size?: string;
  color?: string;
  quantity: number;
}

// ============================================================================
// ORDER TYPES
// ============================================================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentMethod =
  | "credit_card"
  | "debit_card"
  | "paypal"
  | "stripe"
  | "cash_on_delivery";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface OrderItem {
  product: string | Product; // Product ID or populated Product
  quantity: number;
  size: ProductSize;
  price: number;
  totalPrice: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  fullName?: string; // Virtual field
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: Date;
}

export interface OrderPricing {
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User; // User ID or populated User
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  pricing: OrderPricing;
  status: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  notes?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderFormData {
  shippingAddress: Omit<ShippingAddress, "fullName">;
  paymentInfo: Omit<PaymentInfo, "status" | "paidAt">;
  notes?: string;
}

// ============================================================================
// SHIPPING TYPES
// ============================================================================

export interface ShippingOption {
  id: string;
  label: string;
  fee: number;
  estimatedDays: string;
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "standard",
    label: "Standard (3-5 days)",
    fee: 0,
    estimatedDays: "3-5",
  },
  { id: "express", label: "Express (1-2 days)", fee: 0, estimatedDays: "1-2" },
  { id: "pickup", label: "Store Pickup", fee: 0, estimatedDays: "0" },
] as const;

// ============================================================================
// PROMO CODE TYPES
// ============================================================================

export interface PromoCode {
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  isActive: boolean;
  validFrom?: Date;
  validUntil?: Date;
  usageLimit?: number;
  usedCount?: number;
}

export interface PromoCodeValidation {
  isValid: boolean;
  discount: number;
  message: string;
  type: "percentage" | "fixed" | "free_shipping";
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface FilterState {
  filters: ProductFilters;
  sort: ProductSortOptions;
  page: number;
  limit: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  error?: string;
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, size?: string, color?: string) => void;
  onViewDetails?: (product: Product) => void;
  showQuickActions?: boolean;
}

export interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (
    productId: string,
    size: string | undefined,
    color: string | undefined,
    quantity: number
  ) => void;
  onRemove: (productId: string, size?: string, color?: string) => void;
}

export interface OrderCardProps {
  order: Order;
  onViewDetails?: (order: Order) => void;
  onTrackOrder?: (order: Order) => void;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

export interface EnvironmentVariables {
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
  AUTH_GOOGLE_ID: string;
  AUTH_CLIENT_SECRET: string;
  MONGODB_URI: string;
  NEXT_PUBLIC_API_URL: string;
  NODE_ENV: "development" | "production" | "test";
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "shirts",
  "pants",
  "dresses",
  "shoes",
  "accessories",
  "jackets",
  "hoodies",
];

export const PRODUCT_SIZES: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL"];

export const PRODUCT_GENDERS: ProductGender[] = [
  "Men",
  "Women",
  "Unisex",
  "Kids",
];

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  "credit_card",
  "debit_card",
  "paypal",
  "stripe",
  "cash_on_delivery",
];
