import { create } from "zustand"
import { Category } from "@/types/api"
import { categoryService } from "@/api/products/categories/categoryService"

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
      const response = await categoryService.getCategories()
      set({ categories: response.info.data })
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      set({ isLoading: false })
    }
  },
}))