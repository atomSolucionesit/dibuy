// Configuración de la API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
} as const;

// Configuración de caché
export const CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutos
  GC_TIME: 10 * 60 * 1000, // 10 minutos
  LONG_STALE_TIME: 30 * 60 * 1000, // 30 minutos
  LONG_GC_TIME: 60 * 60 * 1000, // 1 hora
} as const;

// Estados de órdenes
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// Estados de pago
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
} as const;

// Roles de usuario
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

// Configuración de validación
export const VALIDATION_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 254,
  NAME_MAX_LENGTH: 100,
  PHONE_MAX_LENGTH: 20,
} as const;

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 5,
} as const;

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  AUTO_HIDE_DURATION: 5000, // 5 segundos
  MAX_NOTIFICATIONS: 5,
} as const;

// Configuración de búsqueda
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 100,
  DEBOUNCE_DELAY: 300, // 300ms
} as const;

// Configuración de carrito
export const CART_CONFIG = {
  MAX_QUANTITY: 99,
  MIN_QUANTITY: 1,
  AUTO_SAVE_DELAY: 1000, // 1 segundo
} as const;

// Configuración de reseñas
export const REVIEW_CONFIG = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  MIN_COMMENT_LENGTH: 10,
  MAX_COMMENT_LENGTH: 1000,
} as const;

// Configuración de productos
export const PRODUCT_CONFIG = {
  MAX_IMAGES: 10,
  MAX_DESCRIPTION_LENGTH: 2000,
  MAX_SPECIFICATIONS: 50,
} as const;

// Configuración de categorías
export const CATEGORY_CONFIG = {
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_DEPTH: 5,
} as const;

// Configuración de direcciones
export const ADDRESS_CONFIG = {
  MAX_ADDRESS_LENGTH: 200,
  MAX_CITY_LENGTH: 100,
  MAX_STATE_LENGTH: 100,
  MAX_ZIPCODE_LENGTH: 20,
  MAX_COUNTRY_LENGTH: 100,
  MAX_PHONE_LENGTH: 20,
} as const;

// Configuración de cupones
export const COUPON_CONFIG = {
  MAX_CODE_LENGTH: 20,
  MIN_DISCOUNT: 0,
  MAX_DISCOUNT: 100,
} as const;

// Configuración de envío
export const SHIPPING_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 50000, // $500
  DEFAULT_SHIPPING_COST: 5000, // $50
  MAX_SHIPPING_COST: 50000, // $500
} as const;

// Configuración de impuestos
export const TAX_CONFIG = {
  DEFAULT_TAX_RATE: 0.19, // 19%
  MAX_TAX_RATE: 0.50, // 50%
} as const;

// Configuración de moneda
export const CURRENCY_CONFIG = {
  DEFAULT_CURRENCY: 'COP',
  DECIMAL_PLACES: 0,
  THOUSAND_SEPARATOR: '.',
  DECIMAL_SEPARATOR: ',',
} as const;

// Configuración de idioma
export const LANGUAGE_CONFIG = {
  DEFAULT_LANGUAGE: 'es',
  SUPPORTED_LANGUAGES: ['es', 'en'],
} as const;

// Configuración de zona horaria
export const TIMEZONE_CONFIG = {
  DEFAULT_TIMEZONE: 'America/Bogota',
} as const;

// Configuración de seguridad
export const SECURITY_CONFIG = {
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 días
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
} as const;
