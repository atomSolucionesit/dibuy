import apiClient from '@/lib/api';
import { 
  Cart, 
  CartItem, 
  ApiResponse 
} from '@/types/api';

export class CartService {
  // Obtener carrito del usuario
  static async getCart(): Promise<Cart> {
    try {
      const response = await apiClient.get<ApiResponse<Cart>>('/cart');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener carrito');
    }
  }

  // Agregar producto al carrito
  static async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
    try {
      const response = await apiClient.post<ApiResponse<Cart>>('/cart/items', {
        productId,
        quantity
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al agregar producto al carrito');
    }
  }

  // Actualizar cantidad de un item en el carrito
  static async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    try {
      const response = await apiClient.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, {
        quantity
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar item del carrito');
    }
  }

  // Remover item del carrito
  static async removeFromCart(itemId: string): Promise<Cart> {
    try {
      const response = await apiClient.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al remover item del carrito');
    }
  }

  // Limpiar carrito
  static async clearCart(): Promise<Cart> {
    try {
      const response = await apiClient.delete<ApiResponse<Cart>>('/cart');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al limpiar carrito');
    }
  }

  // Obtener cantidad de items en el carrito
  static async getCartItemCount(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ itemCount: number }>>('/cart/count');
      return response.data.data.itemCount;
    } catch (error: any) {
      return 0; // Si hay error, retornar 0
    }
  }

  // Aplicar cupón al carrito
  static async applyCoupon(code: string): Promise<Cart> {
    try {
      const response = await apiClient.post<ApiResponse<Cart>>('/cart/coupon', {
        code
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al aplicar cupón');
    }
  }

  // Remover cupón del carrito
  static async removeCoupon(): Promise<Cart> {
    try {
      const response = await apiClient.delete<ApiResponse<Cart>>('/cart/coupon');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al remover cupón');
    }
  }

  // Guardar carrito para más tarde
  static async saveForLater(itemId: string): Promise<Cart> {
    try {
      const response = await apiClient.post<ApiResponse<Cart>>(`/cart/items/${itemId}/save`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al guardar item para más tarde');
    }
  }

  // Mover item de guardado al carrito
  static async moveToCart(itemId: string): Promise<Cart> {
    try {
      const response = await apiClient.post<ApiResponse<Cart>>(`/cart/saved/${itemId}/move`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al mover item al carrito');
    }
  }

  // Obtener items guardados para más tarde
  static async getSavedItems(): Promise<CartItem[]> {
    try {
      const response = await apiClient.get<ApiResponse<CartItem[]>>('/cart/saved');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener items guardados');
    }
  }

  // Verificar disponibilidad de productos en el carrito
  static async checkCartAvailability(): Promise<{
    available: CartItem[];
    unavailable: CartItem[];
  }> {
    try {
      const response = await apiClient.get<ApiResponse<{
        available: CartItem[];
        unavailable: CartItem[];
      }>>('/cart/availability');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al verificar disponibilidad');
    }
  }

  // Calcular envío del carrito
  static async calculateShipping(zipCode: string): Promise<{
    options: Array<{
      id: string;
      name: string;
      price: number;
      estimatedDays: number;
    }>;
    selected?: string;
  }> {
    try {
      const response = await apiClient.post<ApiResponse<{
        options: Array<{
          id: string;
          name: string;
          price: number;
          estimatedDays: number;
        }>;
        selected?: string;
      }>>('/cart/shipping', { zipCode });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al calcular envío');
    }
  }

  // Seleccionar método de envío
  static async selectShippingMethod(shippingId: string): Promise<Cart> {
    try {
      const response = await apiClient.put<ApiResponse<Cart>>('/cart/shipping', {
        shippingId
      });
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al seleccionar método de envío');
    }
  }

  // Obtener resumen del carrito
  static async getCartSummary(): Promise<{
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    itemCount: number;
  }> {
    try {
      const response = await apiClient.get<ApiResponse<{
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        total: number;
        itemCount: number;
      }>>('/cart/summary');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener resumen del carrito');
    }
  }
}
