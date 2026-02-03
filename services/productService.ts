import { api } from "@/api/index";
import { Product, Category } from "@/types/api";

export const ProductService = {
  // Filtrar productos publicados
  filterPublishedProducts(products: Product[]) {
    return products.filter(product => product.published === true);
  },

  async getProducts(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      published: 'true', // Solo productos publicados
      ...filters,
    });

    const response = await api.get(`/products?${params}`);
    const data = response.data.info || response.data;
    
    // Filtro adicional del lado cliente
    if (data.data && Array.isArray(data.data)) {
      data.data = this.filterPublishedProducts(data.data);
    }
    
    return data;
  },

  async getProductById(id: string) {
    const response = await api.get(`/products/${id}`);
    return response.data.info?.data || response.data.data || response.data;
  },

  async getOutstandingProducts(limit = 4) {
    const response = await api.get(`/products/outstanding?limit=${limit}&published=true`);
    const data = response.data.info?.data || response.data;
    return Array.isArray(data) ? this.filterPublishedProducts(data) : data;
  },

  async searchProducts(query: string) {
    const response = await api.get(
      `/products/search?q=${encodeURIComponent(query)}&published=true`
    );
    const data = response.data.info?.data || response.data;
    return Array.isArray(data) ? this.filterPublishedProducts(data) : data;
  },

  async getCategories() {
    const response = await api.get("/category");
    return response.data.info?.data || response.data;
  },

  async getProductsByCategory(categoryId: string, page = 1, limit = 20) {
    const response = await api.get(
      `/category/${categoryId}/products?page=${page}&limit=${limit}&published=true`
    );

    const data = response.data.info || response.data;
    
    // Filtro adicional del lado cliente
    if (data.data && Array.isArray(data.data)) {
      data.data = this.filterPublishedProducts(data.data);
    }
    
    return data;
  },
};
