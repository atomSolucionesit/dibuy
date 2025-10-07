import { api } from "..";

export const createSale = async (saleData: any): Promise<any> => {
  try {
    const response = await api.post(`/sales`, saleData);
    return response.data;
  } catch (error) {
    console.error("Error creating sale:", error);
    throw error;
  }
};

export const updateSale = async (id: string, saleData: any): Promise<any> => {
  try {
    const response = await api.patch(`/sales/${id}/status`, saleData);
    return response.data;
  } catch (error) {
    console.error("Error updating sale:", error);
    throw error;
  }
};

export const saleService = {
  createSale,
  updateSale
};