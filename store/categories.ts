import { create } from "zustand"
import { Category } from "@/types/api"
import { ProductService } from "@/services/productService"

type CategoryState = {
  categories: Category[]
  isLoading: boolean
  fetchCategories: (page?: number, limit?: number) => Promise<void>
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true })
    try {
      const categories = await ProductService.getCategories()
      set({ categories: categories || [] })
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      set({ isLoading: false })
    }
  },
}))