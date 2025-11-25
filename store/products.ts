import { create } from "zustand"
import { ProductService } from "@/services/productService"
import { Product } from "@/types/api"

type ProductsState = {
  products: Product[]
  isLoading: boolean
  meta: { total: number; page: number; size: number; pages: number } | null
  fetchProducts: (page?: number, limit?: number, categoryId?: string) => Promise<void>
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  isLoading: false,
  meta: null,

  fetchProducts: async (page = 1, limit = 20, categoryId?: string) => {
    set({ isLoading: true })
    try {
      let response
      if (categoryId && categoryId !== 'all') {
        response = await ProductService.getProductsByCategory(categoryId, page, limit)
      } else {
        response = await ProductService.getProducts(page, limit)
      }
      
      if (response?.data) {
        set({ products: response.data, meta: response.meta })
      } else {
        set({ products: response || [], meta: null })
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      set({ products: [], meta: null })
    } finally {
      set({ isLoading: false })
    }
  },
}))