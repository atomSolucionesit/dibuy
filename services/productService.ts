import { api } from "@/api/index";
import { Product, Category } from "@/types/api";

const ECOMMERCE_TOKEN_KEY = "ecommerce_token";
const ECOMMERCE_TOKEN_EXP_KEY = "ecommerce_token_expiry";
const ECOMMERCE_COMPANY_ID_KEY = "ecommerce_company_id";

const getEcommerceCompanyId = (): string | null => {
  if (typeof window === "undefined") return null;
  return (
    sessionStorage.getItem(ECOMMERCE_COMPANY_ID_KEY) ||
    process.env.NEXT_PUBLIC_COMPANY_ID ||
    null
  );
};

const ensureEcommerceCompanyId = async (): Promise<string> => {
  const existing = getEcommerceCompanyId();
  if (existing) return existing;

  if (typeof window === "undefined") {
    throw new Error("No ecommerce companyId disponible");
  }

  const companyToken = process.env.NEXT_PUBLIC_COMPANY_TOKEN;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  if (!companyToken) {
    throw new Error("Falta NEXT_PUBLIC_COMPANY_TOKEN");
  }

  const response = await fetch(`${baseUrl}/auth/ecommerce/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyToken }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Auth ecommerce failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const token =
    data?.info?.access_token ||
    data?.info?.user?.access_token ||
    data?.access_token ||
    data?.token ||
    null;
  const companyId =
    data?.info?.user?.companyId ??
    data?.info?.companyId ??
    null;

  if (token) {
    sessionStorage.setItem(ECOMMERCE_TOKEN_KEY, token);
    sessionStorage.setItem(
      ECOMMERCE_TOKEN_EXP_KEY,
      (Date.now() + 22 * 60 * 60 * 1000).toString()
    );
  }

  if (companyId == null) {
    throw new Error("No ecommerce companyId disponible");
  }

  sessionStorage.setItem(ECOMMERCE_COMPANY_ID_KEY, String(companyId));
  return String(companyId);
};

export const ProductService = {
  // Filtrar productos publicados
  filterPublishedProducts(products: Product[]) {
    return products.filter(product => product.published === true);
  },

  async getProducts(page = 1, limit = 20, filters = {}) {
    const companyId = await ensureEcommerceCompanyId();

    const params = new URLSearchParams({
      page: page.toString(),
      size: limit.toString(),
      ...filters,
    });

    const response = await api.get(`/products/ecommerce/${companyId}?${params}`);
    return response.data.info || response.data;
  },

  async getProductById(id: string) {
    const companyId = await ensureEcommerceCompanyId();

    const response = await api.get(`/products/ecommerce/${companyId}/product/${id}`);
    return response.data.info?.data || response.data.data || response.data;
  },

  async getOutstandingProducts(limit = 4) {
    const companyId = await ensureEcommerceCompanyId();

    const response = await api.get(
      `/products/ecommerce/${companyId}/outstanding?limit=${limit}`
    );
    return response.data.info?.data || response.data;
  },

  async searchProducts(query: string) {
    const companyId = await ensureEcommerceCompanyId();

    const params = new URLSearchParams({
      page: "1",
      size: "20",
      search: query,
    });

    const response = await api.get(`/products/ecommerce/${companyId}?${params}`);
    const data = response.data.info || response.data;
    return data.data || data;
  },

  async getCategories() {
    const response = await api.get("/category");
    return response.data.info?.data || response.data;
  },

  async getProductsByCategory(categoryId: string, page = 1, limit = 20) {
    const companyId = await ensureEcommerceCompanyId();

    const response = await api.get(
      `/products/ecommerce/${companyId}/category/${categoryId}?page=${page}&size=${limit}`
    );

    return response.data.info || response.data;
  },

  async getPublishedCategories() {
    const companyId = await ensureEcommerceCompanyId();

    const size = 50;
    let page = 1;
    const maxPages = 20;
    const categoriesMap = new Map<string, Category>();

    while (page <= maxPages) {
      const response = await api.get(
        `/products/ecommerce/${companyId}?page=${page}&size=${size}`
      );
      const info = response.data.info || response.data;
      const products: Product[] = info.data || [];

      products.forEach((product) => {
        if (product.CategoryProduct && Array.isArray(product.CategoryProduct)) {
          product.CategoryProduct.forEach((cp: any) => {
            if (cp?.category?.id) {
              categoriesMap.set(cp.category.id, cp.category);
            }
          });
        }
      });

      const meta = info.meta;
      if (!meta || page >= meta.pages) {
        break;
      }

      page += 1;
    }

    if (page > maxPages) {
      console.warn("getPublishedCategories: se alcanzÃ³ maxPages");
    }

    return Array.from(categoriesMap.values());
  },
};
