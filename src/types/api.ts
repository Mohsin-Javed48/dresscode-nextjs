// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
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
// API REQUEST TYPES
// ============================================================================

export interface ApiRequest {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
}

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  retries: number;
  retryDelay: number;
}

// ============================================================================
// API CLIENT TYPES
// ============================================================================

export interface ApiClient {
  get: <T>(
    url: string,
    params?: Record<string, any>
  ) => Promise<ApiResponse<T>>;
  post: <T>(url: string, data?: any) => Promise<ApiResponse<T>>;
  put: <T>(url: string, data?: any) => Promise<ApiResponse<T>>;
  patch: <T>(url: string, data?: any) => Promise<ApiResponse<T>>;
  delete: <T>(url: string) => Promise<ApiResponse<T>>;
}

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
  retryDelay?: number;
  onError?: (error: ApiError) => void;
  onRequest?: (request: ApiRequest) => void;
  onResponse?: (response: ApiResponse) => void;
}

// ============================================================================
// API HOOK TYPES
// ============================================================================

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface UseApiOptions {
  immediate?: boolean;
  retries?: number;
  retryDelay?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
  refetch: () => Promise<T>;
}

// ============================================================================
// API ENDPOINT TYPES
// ============================================================================

export interface ApiEndpoints {
  // Products
  products: {
    list: string;
    detail: (id: string) => string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    search: string;
    categories: string;
  };

  // Cart
  cart: {
    get: (userId: string) => string;
    add: (userId: string) => string;
    update: (userId: string) => string;
    remove: (userId: string) => string;
    clear: (userId: string) => string;
  };

  // Orders
  orders: {
    list: string;
    detail: (id: string) => string;
    create: string;
    update: (id: string) => string;
    cancel: (id: string) => string;
    track: (id: string) => string;
  };

  // Reviews
  reviews: {
    list: (productId: string) => string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
  };

  // Auth
  auth: {
    login: string;
    logout: string;
    register: string;
    profile: string;
    refresh: string;
  };
}

// ============================================================================
// API VALIDATION TYPES
// ============================================================================

export interface ApiValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ApiValidationResponse {
  success: false;
  message: string;
  errors: ApiValidationError[];
  timestamp: string;
}

// ============================================================================
// API CACHE TYPES
// ============================================================================

export interface ApiCacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
  maxSize: number;
  strategy: "memory" | "localStorage" | "sessionStorage";
}

export interface ApiCacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface ApiCache {
  get: <T>(key: string) => ApiCacheEntry<T> | null;
  set: <T>(key: string, data: T, ttl?: number) => void;
  delete: (key: string) => void;
  clear: () => void;
  has: (key: string) => boolean;
}

// ============================================================================
// API INTERCEPTOR TYPES
// ============================================================================

export interface ApiInterceptor {
  request?: (config: ApiRequest) => ApiRequest | Promise<ApiRequest>;
  response?: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;
  error?: (error: ApiError) => ApiError | Promise<ApiError>;
}

export interface ApiInterceptorManager {
  add: (interceptor: ApiInterceptor) => number;
  remove: (id: number) => void;
  clear: () => void;
}

// ============================================================================
// API RATE LIMITING TYPES
// ============================================================================

export interface ApiRateLimit {
  requests: number;
  window: number; // Window in milliseconds
  remaining: number;
  reset: number; // Reset timestamp
}

export interface ApiRateLimitConfig {
  enabled: boolean;
  requests: number;
  window: number;
  onLimitExceeded?: (limit: ApiRateLimit) => void;
}

// ============================================================================
// API RETRY TYPES
// ============================================================================

export interface ApiRetryConfig {
  enabled: boolean;
  maxRetries: number;
  retryDelay: number;
  retryCondition: (error: ApiError) => boolean;
  onRetry?: (attempt: number, error: ApiError) => void;
}

// ============================================================================
// API MONITORING TYPES
// ============================================================================

export interface ApiMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  requestsPerMinute: number;
  errorRate: number;
}

export interface ApiMonitoringConfig {
  enabled: boolean;
  collectMetrics: boolean;
  logRequests: boolean;
  logResponses: boolean;
  onMetricsUpdate?: (metrics: ApiMetrics) => void;
}

// ============================================================================
// API SECURITY TYPES
// ============================================================================

export interface ApiSecurityConfig {
  csrfProtection: boolean;
  corsEnabled: boolean;
  rateLimiting: boolean;
  authentication: boolean;
  authorization: boolean;
  encryption: boolean;
}

export interface ApiSecurityHeaders {
  "X-CSRF-Token"?: string;
  "X-Requested-With"?: string;
  Authorization?: string;
  "Content-Type"?: string;
  Accept?: string;
}

// ============================================================================
// API TESTING TYPES
// ============================================================================

export interface ApiTestConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  mockResponses: boolean;
  testData: Record<string, any>;
}

export interface ApiTestSuite {
  name: string;
  tests: ApiTestCase[];
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
}

export interface ApiTestCase {
  name: string;
  request: ApiRequest;
  expectedResponse: Partial<ApiResponse>;
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
}
