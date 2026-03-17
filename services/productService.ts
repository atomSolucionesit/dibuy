import { api } from "@/api/index";
import { Product } from "@/types/api";

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
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

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
    data?.info?.user?.companyId ?? data?.info?.companyId ?? null;

  if (token) {
    sessionStorage.setItem(ECOMMERCE_TOKEN_KEY, token);
    sessionStorage.setItem(
      ECOMMERCE_TOKEN_EXP_KEY,
      (Date.now() + 22 * 60 * 60 * 1000).toString(),
    );
  }

  if (companyId == null) {
    throw new Error("No ecommerce companyId disponible");
  }

  sessionStorage.setItem(ECOMMERCE_COMPANY_ID_KEY, String(companyId));
  return String(companyId);
};

const mapPromotionToProduct = (promotion: any): Product => ({
  ...promotion,
  id: `promo-${promotion.id}`,
  dbPromotionId: promotion.id,
  sellingPrice: Number(promotion.total || 0),
  originalPrice: undefined,
  name: promotion.name,
  sku: `PROMO-${promotion.id}`,
  isPromotion: true,
  published: true,
  stock: Number(promotion.stockAvailable ?? promotion.availableStock ?? 0),
  images: promotion.image
    ? [{
        id: `promotion-image-${promotion.id}`,
        url: promotion.image,
        productId: `promo-${promotion.id}`,
        createdAt: new Date().toISOString(),
      }]
    : promotion.promotionProduct?.[0]?.product?.images || [],
  category: "Promoci?n",
  badge: "PROMO",
  description: promotion.description || "Combo de productos en oferta",
  CategoryProduct: [],
});

export const ProductService = {
  // Filtrar productos publicados
  filterPublishedProducts(products: Product[]) {
    return products.filter((product) => product.published === true);
  },

  async getProducts(page = 1, limit = 20, filters = {}) {
    const companyId = await ensureEcommerceCompanyId();

    const params = new URLSearchParams({
      page: page.toString(),
      size: limit.toString(),
      ...filters,
    });

    const response = await api.get(
      `/products/ecommerce/${companyId}?${params}`,
    );
    return response.data.info || response.data;
  },

  async getProductById(id: string) {
    const companyId = await ensureEcommerceCompanyId();

    const response = await api.get(
      `/products/ecommerce/${companyId}/product/${id}`,
    );
    return response.data.info?.data || response.data.data || response.data;
  },

  async getOutstandingProducts(limit = 4) {
    const companyId = await ensureEcommerceCompanyId();

    const response = await api.get(
      `/products/ecommerce/${companyId}/outstanding?limit=${limit}`,
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

    const response = await api.get(
      `/products/ecommerce/${companyId}?${params}`,
    );
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
      `/products/ecommerce/${companyId}/category/${categoryId}?page=${page}&size=${limit}`,
    );

    return response.data.info || response.data;
  },

  async getPublishedCategories() {
    await ensureEcommerceCompanyId();

    const response = await api.get("/category/all?size=0");
    return response.data.info?.data || response.data;
  },

  async getPromotions() {
    const companyId = await ensureEcommerceCompanyId();
    const response = await api.get(`/promotions/ecommerce/${companyId}`);
    return response.data.data || response.data || [];
  },

  async getPromotionCatalog() {
    const promotions = await this.getPromotions();
    return (Array.isArray(promotions) ? promotions : []).map(mapPromotionToProduct);
  },

  async getPromotionById(id: string) {
    const companyId = await ensureEcommerceCompanyId();
    const response = await api.get(
      `/promotions/ecommerce/${companyId}/promotion/${id}`,
    );
    const promotion = response.data.data || response.data;
    return mapPromotionToProduct(promotion);
  },
};
