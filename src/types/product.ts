import { Product, ProductFilters, ProductSortOptions, Review } from "./index";

// ============================================================================
// PRODUCT API TYPES
// ============================================================================

export interface ProductListParams {
  page?: number;
  limit?: number;
  filters?: ProductFilters;
  sort?: ProductSortOptions;
  search?: string;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: ProductFilters;
}

export interface ProductDetailResponse {
  product: Product;
  relatedProducts: Product[];
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

// ============================================================================
// PRODUCT COMPONENT TYPES
// ============================================================================

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, size?: string, color?: string) => void;
  onViewDetails?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  showQuickActions?: boolean;
  variant?: "default" | "compact" | "detailed";
  className?: string;
}

export interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product, size?: string, color?: string) => void;
  showFilters?: boolean;
  className?: string;
}

export interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClearFilters: () => void;
  className?: string;
}

export interface ProductSortProps {
  sort: ProductSortOptions;
  onSortChange: (sort: ProductSortOptions) => void;
  className?: string;
}

// ============================================================================
// PRODUCT FORM TYPES
// ============================================================================

export interface ProductFormData {
  name: string;
  title?: string;
  price: number;
  category: string;
  style?: string;
  discount: number;
  image: string;
  size: string;
  season: string;
  stockAvailable: number;
  description?: string;
  gender: string;
  color?: string;
  brand?: string;
  material?: string;
  careInstructions?: string;
  tags?: string[];
  isActive?: boolean;
}

export interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  className?: string;
}

// ============================================================================
// PRODUCT SEARCH TYPES
// ============================================================================

export interface SearchSuggestion {
  id: string;
  text: string;
  type: "product" | "category" | "brand";
  count?: number;
}

export interface SearchResults {
  products: Product[];
  suggestions: SearchSuggestion[];
  totalResults: number;
  searchTime: number;
  query: string;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  className?: string;
}

// ============================================================================
// PRODUCT WISHLIST TYPES
// ============================================================================

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: Date;
}

export interface WishlistProps {
  items: WishlistItem[];
  onRemoveItem: (productId: string) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  loading?: boolean;
  className?: string;
}

// ============================================================================
// PRODUCT COMPARISON TYPES
// ============================================================================

export interface ProductComparisonProps {
  products: Product[];
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
  maxProducts?: number;
  className?: string;
}

// ============================================================================
// PRODUCT RECOMMENDATION TYPES
// ============================================================================

export interface ProductRecommendation {
  product: Product;
  reason: string;
  confidence: number;
}

export interface RecommendationProps {
  recommendations: ProductRecommendation[];
  title?: string;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product, size?: string, color?: string) => void;
  className?: string;
}

// ============================================================================
// PRODUCT ANALYTICS TYPES
// ============================================================================

export interface ProductAnalytics {
  views: number;
  cartAdds: number;
  purchases: number;
  wishlistAdds: number;
  conversionRate: number;
  averageRating: number;
  totalReviews: number;
}

export interface ProductStatsProps {
  analytics: ProductAnalytics;
  product: Product;
  className?: string;
}
