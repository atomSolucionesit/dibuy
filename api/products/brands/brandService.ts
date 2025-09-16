import { Brand } from "../../../types/api";
import { api } from "@/api";

export const getBrands = async (): Promise<Brand[]> => {
  try {
    const response = await api.get("/brand");
    return response.data.info.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const createBrand = async (brandData: {
  name: string;
}): Promise<Brand> => {
  try {
    const response = await api.post("/brand", brandData);
    return response.data;
  } catch (error) {
    console.error("Error creating brand:", error);
    throw error;
  }
};

export const brandService = {
  getBrands,
  createBrand,
};
