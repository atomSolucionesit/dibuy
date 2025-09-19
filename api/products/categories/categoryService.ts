import {
  Category,
  PaginatedCategoriesResponse,
} from "../../../types/api";
import { api } from "@/api";

export const getCategories = async (): Promise<PaginatedCategoriesResponse> => {
  try {
    const response = await api.get("/category", {
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await api.get(`/category/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw error;
  }
};

export const categoryService = {
  getCategories,
  getCategoryById,
}
