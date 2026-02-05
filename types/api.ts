// Tipos base para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Tipos para productos
export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  sellingPrice: number;
  originalPrice?: number;
  images: ProductImage[];
  category: string;
  brandId: number;
  stock: number;
  rating: number;
  reviews: number;
  specifications: Record<string, any>;
  isActive: boolean;
  haveIvaInPrice: boolean;
  createdAt: string;
  updatedAt: string;
  badge: string;
  outstandingDescription?: string;
  CategoryProduct: Category[];
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  search?: string;
}

export interface ProductFormData {
  name: string;
  color: string;
  talle: string;
  stock: number;
  sku: string;
  published: boolean;
  categoryIds: string[];
  haveIvaInPrice: boolean;
  images: string[];

  // Campos opcionales
  codeBars?: string;
  location?: string;
  brandId?: number;
  internalProviderId?: string;
  /**
   * Precio de compra en pesos argentinos (ARS)
   */
  purchasePrice?: number;
  /**
   * Precio de venta en pesos argentinos (ARS), calculado automáticamente con un 30% de margen sobre purchasePrice
   */
  sellingPrice?: number;
  minStock?: number;
  taxId?: number;
}

export interface ProductUploadImageResponse {
  success: boolean;
  url: string;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PaginatedProductsResponse {
  status: number;
  message: string;
  info: {
    data: Product[];
    meta: PaginationMeta;
  };
}

export interface ProductImage {
  id: string;
  url: string;
  productId: string;
  createdAt: string;
}

// Tipos para categorías
export interface Category {
  categoryId?: any;
  id: string;
  name: string;
  slug?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedCategoriesResponse {
  status: number;
  message: string;
  info: {
    data: Category[];
    meta: PaginationMeta;
  };
}

// Tipos para brands
export interface Brand {
  id: number;
  name: string;
  description?: string;
}

// Tipos para usuarios
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

// Tipos para autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Tipos para carrito
export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

// Tipos para órdenes
export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  updatedAt: string;
}

// Tipos para direcciones
export interface Address {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

// Tipos para favoritos
export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: string;
}

// Tipos para reseñas
export interface Review {
  id: string;
  userId: string;
  productId: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para búsqueda
export interface SearchResult {
  products: Product[];
  categories: Category[];
  total: number;
}

// Tipos para errores
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
