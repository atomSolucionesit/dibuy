import { api } from "@/api";

export const createSale = async (saleData: any): Promise<any> => {
  try {
    const response = await api.post(`/sales`, saleData);
    return response.data;
  } catch (error) {
    console.error("Error creating sale:", error);
    throw error;
  }
};