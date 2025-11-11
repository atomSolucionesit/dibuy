import { api } from "@/api";
import {
  Product,
  ProductFilters,
  Category,
  Review,
  ApiResponse,
  PaginatedResponse,
} from "@/types/api";

export class ProductService {
  // Obtener todos los productos con paginación y filtros
  static async getProducts(
    page: number = 1,
    limit: number = 12,
    filters?: ProductFilters
  ): Promise<PaginatedResponse<Product>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters &&
          Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined)
          )),
      });

      const response = await api.get<ApiResponse<PaginatedResponse<Product>>>(
        `/products?${params.toString()}`
      );

      console.log("Products API response:", response.data);
      return {
        data: response.data.data || [],
        meta: response.data.meta || { total: 0, page: 1, size: 0, pages: 0 },
      };
    } catch (error: any) {
      console.error("ProductService.getProducts error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error al obtener productos";
      throw new Error(message);
    }
  }

  // Obtener producto por ID
  static async getProductById(id: string): Promise<Product> {
    try {
      const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al obtener producto"
      );
    }
  }

  // Obtener productos por categoría
  static async getProductsByCategory(
    categorySlug: string,
    page: number = 1,
    limit: number = 12,
    filters?: Omit<ProductFilters, "category">
  ): Promise<PaginatedResponse<Product>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters &&
          Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined)
          )),
      });

      const response = await api.get<ApiResponse<PaginatedResponse<Product>>>(
        `/categories/${categorySlug}/products?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Error al obtener productos de la categoría"
      );
    }
  }

  // Obtener productos destacados
  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    try {
      const response = await api.get<ApiResponse<Product[]>>(
        `/products/featured?limit=${limit}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al obtener productos destacados"
      );
    }
  }

  // Obtener productos en oferta
  static async getOnSaleProducts(limit: number = 8): Promise<Product[]> {
    try {
      const response = await api.get<ApiResponse<Product[]>>(
        `/products/on-sale?limit=${limit}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al obtener productos en oferta"
      );
    }
  }

  // Obtener productos relacionados
  static async getRelatedProducts(
    productId: string,
    limit: number = 4
  ): Promise<Product[]> {
    try {
      const response = await api.get<ApiResponse<Product[]>>(
        `/products/${productId}/related?limit=${limit}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Error al obtener productos relacionados"
      );
    }
  }

  // Buscar productos
  static async searchProducts(
    query: string,
    page: number = 1,
    limit: number = 12,
    filters?: Omit<ProductFilters, "search">
  ): Promise<PaginatedResponse<Product>> {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
        ...(filters &&
          Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined)
          )),
      });

      const response = await api.get<ApiResponse<PaginatedResponse<Product>>>(
        `/products/search?${params.toString()}`
      );

      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al buscar productos"
      );
    }
  }

  // Obtener todas las categorías
  static async getCategories(): Promise<Category[]> {
    try {
      // Intentar obtener categorías del endpoint específico
      const response = await api.get<ApiResponse<Category[]>>("/category");
      console.log("Categories API response:", response.data);
      return response.data.info?.data || response.data.data || [];
    } catch (error: any) {
      console.log("Categories endpoint not available, using fallback categories");
      // Fallback: crear categorías por defecto
      return [
        { id: "1", name: "Smartphones", slug: "smartphones" },
        { id: "2", name: "Laptops", slug: "laptops" },
        { id: "3", name: "Tablets", slug: "tablets" },
        { id: "4", name: "Accesorios", slug: "accesorios" },
        { id: "5", name: "Gaming", slug: "gaming" },
        { id: "6", name: "Audio", slug: "audio" },
      ];
    }
  }

  // Obtener categoría por slug
  static async getCategoryBySlug(slug: string): Promise<Category> {
    try {
      const response = await api.get<ApiResponse<Category>>(
        `/categories/${slug}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al obtener categoría"
      );
    }
  }

  // Obtener reseñas de un producto
  static async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Review>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Review>>>(
        `/products/${productId}/reviews?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al obtener reseñas"
      );
    }
  }

  // Crear reseña de un producto
  static async createProductReview(
    productId: string,
    rating: number,
    comment: string
  ): Promise<Review> {
    try {
      const response = await api.post<ApiResponse<Review>>(
        `/products/${productId}/reviews`,
        {
          rating,
          comment,
        }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Error al crear reseña");
    }
  }

  // Obtener marcas disponibles
  static async getBrands(): Promise<string[]> {
    try {
      const response = await api.get<ApiResponse<string[]>>("/products/brands");
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al obtener marcas"
      );
    }
  }

  // Obtener productos por marca
  static async getProductsByBrand(
    brand: string,
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedResponse<Product>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Product>>>(
        `/products/brand/${brand}?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Error al obtener productos de la marca"
      );
    }
  }

  // Obtener productos más vendidos
  static async getBestSellers(limit: number = 8): Promise<Product[]> {
    try {
      const response = await api.get<ApiResponse<Product[]>>(
        `/products/best-sellers?limit=${limit}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Error al obtener productos más vendidos"
      );
    }
  }

  // Obtener productos nuevos
  static async getNewArrivals(limit: number = 8): Promise<Product[]> {
    try {
      const response = await api.get<ApiResponse<Product[]>>(
        `/products/new-arrivals?limit=${limit}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al obtener productos nuevos"
      );
    }
  }

  // Obtener productos destacados (outstanding)
  static async getOutstandingProducts(limit: number = 4): Promise<Product[]> {
    try {
      const response = await api.get<ApiResponse<Product[]>>(
        `/products/outstanding?limit=${limit}`
      );
      console.log("Outstanding products API response:", response.data);
      return response.data.info?.data || response.data.data || [];
    } catch (error: any) {
      console.error("ProductService.getOutstandingProducts error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error al obtener productos destacados";
      throw new Error(message);
    }
  }

  // Verificar stock de un producto
  static async checkProductStock(
    productId: string,
    quantity: number = 1
  ): Promise<boolean> {
    try {
      const response = await api.get<ApiResponse<{ available: boolean }>>(
        `/products/${productId}/stock?quantity=${quantity}`
      );
      return response.data.data.available;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error al verificar stock"
      );
    }
  }
}
