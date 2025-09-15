import { ApiError } from '@/types/api';

// Función para manejar errores de API
export function handleApiError(error: any): ApiError {
  if (error.response) {
    // Error de respuesta del servidor
    const { status, data } = error.response;
    
    return {
      message: data?.message || `Error ${status}: ${getStatusMessage(status)}`,
      code: data?.code || `HTTP_${status}`,
      details: data?.details || null,
    };
  } else if (error.request) {
    // Error de red (sin respuesta del servidor)
    return {
      message: 'Error de conexión. Verifica tu conexión a internet.',
      code: 'NETWORK_ERROR',
      details: null,
    };
  } else {
    // Error de configuración o otro tipo
    return {
      message: error.message || 'Error desconocido',
      code: 'UNKNOWN_ERROR',
      details: null,
    };
  }
}

// Función para obtener mensajes de estado HTTP
function getStatusMessage(status: number): string {
  const statusMessages: Record<number, string> = {
    400: 'Solicitud incorrecta',
    401: 'No autorizado',
    403: 'Prohibido',
    404: 'No encontrado',
    405: 'Método no permitido',
    409: 'Conflicto',
    422: 'Entidad no procesable',
    429: 'Demasiadas solicitudes',
    500: 'Error interno del servidor',
    502: 'Puerta de enlace incorrecta',
    503: 'Servicio no disponible',
    504: 'Tiempo de espera agotado',
  };

  return statusMessages[status] || 'Error del servidor';
}

// Función para validar respuesta de API
export function validateApiResponse<T>(response: any): T {
  if (!response || typeof response !== 'object') {
    throw new Error('Respuesta de API inválida');
  }

  if (!response.success && response.success !== false) {
    throw new Error('Respuesta de API malformada');
  }

  if (!response.success) {
    throw new Error(response.message || 'Error en la operación');
  }

  return response.data;
}

// Función para construir parámetros de consulta
export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}

// Función para formatear errores de validación
export function formatValidationErrors(errors: Record<string, string[]>): string[] {
  const formattedErrors: string[] = [];

  Object.entries(errors).forEach(([field, fieldErrors]) => {
    fieldErrors.forEach(error => {
      formattedErrors.push(`${field}: ${error}`);
    });
  });

  return formattedErrors;
}

// Función para verificar si un error es de red
export function isNetworkError(error: any): boolean {
  return !error.response && error.request;
}

// Función para verificar si un error es de autenticación
export function isAuthError(error: any): boolean {
  return error.response?.status === 401 || error.response?.status === 403;
}

// Función para verificar si un error es de validación
export function isValidationError(error: any): boolean {
  return error.response?.status === 422;
}

// Función para verificar si un error es de servidor
export function isServerError(error: any): boolean {
  return error.response?.status >= 500;
}

// Función para obtener el mensaje de error más apropiado
export function getErrorMessage(error: any): string {
  const apiError = handleApiError(error);
  
  if (isNetworkError(error)) {
    return 'Error de conexión. Verifica tu conexión a internet.';
  }
  
  if (isAuthError(error)) {
    return 'Sesión expirada. Por favor, inicia sesión nuevamente.';
  }
  
  if (isServerError(error)) {
    return 'Error del servidor. Inténtalo de nuevo más tarde.';
  }
  
  return apiError.message;
}

// Función para retry con backoff exponencial
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }

      // No reintentar en errores de autenticación o validación
      if (isAuthError(error) || isValidationError(error)) {
        break;
      }

      // Esperar antes del siguiente intento
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Función para debounce
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Función para throttle
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Función para formatear fechas
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('es-CO', defaultOptions).format(new Date(date));
}

// Función para formatear moneda
export function formatCurrency(
  amount: number,
  currency: string = 'COP',
  locale: string = 'es-CO'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Función para formatear números
export function formatNumber(
  number: number,
  locale: string = 'es-CO',
  options?: Intl.NumberFormatOptions
): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  };

  return new Intl.NumberFormat(locale, defaultOptions).format(number);
}
