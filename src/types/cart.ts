import { CartItem, Cart, CartUpdateData, Product } from "./index";

// ============================================================================
// CART API TYPES
// ============================================================================

export interface CartResponse {
  success: boolean;
  message: string;
  cart: Cart;
  error?: string;
}

export interface AddToCartRequest {
  productId: string;
  size?: string;
  color?: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productId: string;
  size?: string;
  color?: string;
  quantity: number;
}

export interface RemoveFromCartRequest {
  productId: string;
  size?: string;
  color?: string;
}

// ============================================================================
// CART COMPONENT TYPES
// ============================================================================

export interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (
    productId: string,
    size: string | undefined,
    color: string | undefined,
    quantity: number
  ) => void;
  onRemove: (productId: string, size?: string, color?: string) => void;
  onViewProduct?: (productId: string) => void;
  loading?: boolean;
  className?: string;
}

export interface CartSummaryProps {
  items: CartItem[];
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  className?: string;
}

export interface CartEmptyProps {
  onContinueShopping: () => void;
  className?: string;
}

export interface CartQuantityControlsProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  disabled?: boolean;
  className?: string;
}

// ============================================================================
// CART STATE TYPES
// ============================================================================

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  error?: string;
  lastUpdated?: Date;
}

export interface CartActions {
  addItem: (item: AddToCartRequest) => Promise<void>;
  updateItem: (item: UpdateCartItemRequest) => Promise<void>;
  removeItem: (item: RemoveFromCartRequest) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

export interface CartContextType extends CartState, CartActions {}

// ============================================================================
// CART CALCULATION TYPES
// ============================================================================

export interface CartCalculation {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}

export interface CartCalculationProps {
  items: CartItem[];
  shippingCost?: number;
  taxRate?: number;
  discountAmount?: number;
  onCalculationChange?: (calculation: CartCalculation) => void;
  className?: string;
}

// ============================================================================
// CART PERSISTENCE TYPES
// ============================================================================

export interface CartPersistence {
  saveCart: (cart: Cart) => void;
  loadCart: () => Cart | null;
  clearCart: () => void;
}

export interface CartSyncProps {
  userId?: string;
  onSyncComplete?: (cart: Cart) => void;
  onSyncError?: (error: string) => void;
  autoSync?: boolean;
  syncInterval?: number;
}

// ============================================================================
// CART VALIDATION TYPES
// ============================================================================

export interface CartValidation {
  isValid: boolean;
  errors: CartValidationError[];
  warnings: CartValidationWarning[];
}

export interface CartValidationError {
  field: string;
  message: string;
  itemId?: string;
}

export interface CartValidationWarning {
  field: string;
  message: string;
  itemId?: string;
}

export interface CartValidatorProps {
  items: CartItem[];
  onValidationChange?: (validation: CartValidation) => void;
  className?: string;
}

// ============================================================================
// CART ANALYTICS TYPES
// ============================================================================

export interface CartAnalytics {
  totalValue: number;
  itemCount: number;
  averageItemValue: number;
  mostAddedProduct: Product | null;
  cartAbandonmentRate: number;
  conversionRate: number;
}

export interface CartStatsProps {
  analytics: CartAnalytics;
  className?: string;
}

// ============================================================================
// CART WISHLIST INTEGRATION TYPES
// ============================================================================

export interface CartWishlistIntegration {
  moveToWishlist: (
    productId: string,
    size?: string,
    color?: string
  ) => Promise<void>;
  moveFromWishlist: (
    productId: string,
    size?: string,
    color?: string
  ) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export interface CartWishlistProps {
  item: CartItem;
  onMoveToWishlist: (productId: string, size?: string, color?: string) => void;
  isInWishlist: (productId: string) => boolean;
  className?: string;
}

// ============================================================================
// CART SHARING TYPES
// ============================================================================

export interface CartShareData {
  cartId: string;
  shareToken: string;
  expiresAt: Date;
  isPublic: boolean;
}

export interface CartShareProps {
  cart: Cart;
  onShare: () => Promise<CartShareData>;
  onStopSharing: () => Promise<void>;
  className?: string;
}

// ============================================================================
// CART SAVED FOR LATER TYPES
// ============================================================================

export interface SavedForLaterItem {
  productId: string;
  product: Product;
  size?: string;
  color?: string;
  savedAt: Date;
}

export interface SavedForLaterProps {
  items: SavedForLaterItem[];
  onMoveToCart: (item: SavedForLaterItem) => void;
  onRemove: (productId: string) => void;
  className?: string;
}
