import { create } from "zustand"
import { productService } from "@/api/products/catalogo/productService"
import { Product } from "@/types/api"

type ProductsState = {
  products: Product[]
  isLoading: boolean
  fetchProducts: (page?: number, limit?: number) => Promise<void>
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  isLoading: false,

  fetchProducts: async (page = 1, limit = 10) => {
    set({ isLoading: true })
    try {
      const response = await productService.getProducts(page, limit)
      set({ products: response.info.data })
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      set({ isLoading: false })
    }
  },
}))