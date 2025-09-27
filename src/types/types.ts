// ============================================================================
// MAIN TYPES EXPORT
// ============================================================================

// Re-export all types from individual files
export * from "./index";
export * from "./auth";
export * from "./product";
export * from "./cart";
export * from "./order";
export * from "./api";

// ============================================================================
// COMMON UTILITY TYPES
// ============================================================================

export type ID = string;
export type Timestamp = Date | string;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// ============================================================================
// FORM TYPES
// ============================================================================

export interface FormField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  required?: boolean;
}

export interface FormState<T = Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormActions<T = Record<string, any>> {
  setValue: (field: keyof T, value: any) => void;
  setError: (field: keyof T, error: string) => void;
  setTouched: (field: keyof T, touched: boolean) => void;
  setValues: (values: Partial<T>) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  setTouched: (touched: Partial<Record<keyof T, boolean>>) => void;
  reset: () => void;
  submit: () => Promise<void>;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  className?: string;
}

// ============================================================================
// MODAL TYPES
// ============================================================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

export interface ConfirmModalProps extends Omit<ModalProps, "children"> {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "danger" | "warning" | "info";
}

// ============================================================================
// TOAST TYPES
// ============================================================================

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

// ============================================================================
// LOADING TYPES
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  error?: string;
  progress?: number;
}

export interface LoadingProps {
  loading: boolean;
  error?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

// ============================================================================
// SEARCH TYPES
// ============================================================================

export interface SearchState {
  query: string;
  results: any[];
  loading: boolean;
  error?: string;
  suggestions: string[];
}

export interface SearchProps {
  onSearch: (query: string) => void;
  onSuggestionClick?: (suggestion: string) => void;
  placeholder?: string;
  className?: string;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface FilterGroup {
  key: string;
  label: string;
  type: "checkbox" | "radio" | "range" | "select";
  options: FilterOption[];
  value?: any;
}

export interface FilterProps {
  filters: FilterGroup[];
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  className?: string;
}

// ============================================================================
// SORT TYPES
// ============================================================================

export interface SortOption {
  value: string;
  label: string;
  direction: "asc" | "desc";
}

export interface SortProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// ============================================================================
// THEME TYPES
// ============================================================================

export type Theme = "light" | "dark" | "system";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// ============================================================================
// LAYOUT TYPES
// ============================================================================

export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export interface HeaderProps {
  className?: string;
}

export interface FooterProps {
  className?: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  badge?: string | number;
  disabled?: boolean;
}

export interface NavigationProps {
  items: NavItem[];
  className?: string;
}

// ============================================================================
// BREADCRUMB TYPES
// ============================================================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

// ============================================================================
// TAB TYPES
// ============================================================================

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}

// ============================================================================
// ACCORDION TYPES
// ============================================================================

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  onToggle?: (id: string, isOpen: boolean) => void;
  className?: string;
}

// ============================================================================
// DROPDOWN TYPES
// ============================================================================

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// ============================================================================
// TOOLTIP TYPES
// ============================================================================

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

// ============================================================================
// POPOVER TYPES
// ============================================================================

export interface PopoverProps {
  content: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
}

// ============================================================================
// DRAWER TYPES
// ============================================================================

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  position?: "left" | "right" | "top" | "bottom";
  className?: string;
}
