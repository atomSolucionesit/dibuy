import { api } from "@/api/index";
import { Product, Category } from "@/types/api";

export const ProductService = {
  async getProducts(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await api.get(`/products?${params}`);
    return response.data.info || response.data;
  },

  async getProductById(id: string) {
    const response = await api.get(`/products/${id}`);
    console.log('Product API Response:', response.data);
    return response.data.info?.data || response.data.data || response.data;
  },

  async getOutstandingProducts(limit = 4) {
    const response = await api.get(`/products/outstanding?limit=${limit}`);
    return response.data.info?.data || response.data;
  },

  async searchProducts(query: string) {
    const response = await api.get(
      `/products/search?q=${encodeURIComponent(query)}`
    );
    return response.data.info?.data || response.data;
  },

  async getCategories() {
    const response = await api.get("/category");
    return response.data.info?.data || response.data;
  },

  async getProductsByCategory(categoryId: string, page = 1, limit = 20) {
    const response = await api.get(
      `/category/${categoryId}/products?page=${page}&limit=${limit}`
    );

    return response.data.info || response.data;
  },
};
