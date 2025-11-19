import { create } from "zustand"
import { ProductService } from "@/services/productService"
import { Product } from "@/types/api"

type ProductsState = {
  products: Product[]
  isLoading: boolean
  fetchProducts: (page?: number, limit?: number, categoryId?: string) => Promise<void>
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  isLoading: false,

  fetchProducts: async (page = 1, limit = 20, categoryId?: string) => {
    set({ isLoading: true })
    try {
      let products
      if (categoryId && categoryId !== 'all') {
        products = await ProductService.getProductsByCategory(categoryId, page, limit)
      } else {
        products = await ProductService.getProducts(page, limit)
      }
      set({ products: products || [] })
    } catch (error) {
      console.error("Error fetching products:", error)
      set({ products: [] })
    } finally {
      set({ isLoading: false })
    }
  },
}))