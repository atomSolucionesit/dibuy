import { create } from "zustand";
import { ProductService } from "@/services/productService";
import { Product } from "@/types/api";

type ProductsState = {
  products: Product[];
  isLoading: boolean;
  meta: { total: number; page: number; size: number; pages: number } | null;
  fetchProducts: (
    page?: number,
    limit?: number,
    categoryId?: string,
  ) => Promise<void>;
};

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  isLoading: false,
  meta: null,

  fetchProducts: async (page = 1, limit = 20, categoryId?: string) => {
    set({ isLoading: true });
    try {
      let response;
      let promotions: any[] = [];

      // Solo cargar promociones en la primera página y si no hay categoría específica (o es 'all')
      if (page === 1 && (!categoryId || categoryId === "all")) {
        try {
          const promoResp = await ProductService.getPromotions();
          const rawPromos = Array.isArray(promoResp)
            ? promoResp
            : promoResp.data || [];

          promotions = rawPromos.map((p: any) => ({
            ...p,
            id: `promo-${p.id}`,
            dbPromotionId: p.id,
            sellingPrice: p.total,
            name: p.name,
            sku: `PROMO-${p.id}`,
            isPromotion: true,
            published: true,
            stock: p.stockAvailable ?? 0,
            images: p.promotionProduct?.[0]?.product?.images || [],
            category: "Promoción",
            badge: "PROMO",
            description: p.description || "Combo de productos en oferta",
          }));
        } catch (e) {
          console.error("Error fetching promotions:", e);
        }
      }

      if (categoryId && categoryId !== "all") {
        response = await ProductService.getProductsByCategory(
          categoryId,
          page,
          limit,
        );
      } else {
        response = await ProductService.getProducts(page, limit);
      }

      let products = response?.data || response || [];
      let meta = response?.meta || null;

      // Si tenemos promociones, las agregamos al principio
      if (promotions.length > 0) {
        products = [...promotions, ...products];
        if (meta) {
          // Ajustamos el total para que la paginación no se rompa visualmente de inmediato
          // Aunque esto puede causar que la última página tenga menos de lo esperado si no se maneja en el back
          meta.total += promotions.length;
        }
      }

      set({ products, meta });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ products: [], meta: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
