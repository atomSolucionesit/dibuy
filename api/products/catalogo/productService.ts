import {
  Product,
  ProductFormData,
  ProductUploadImageResponse,
  PaginatedProductsResponse
} from "../../../types/api";
import { api } from "@/api";

interface AxiosError {
  response?: {
    data?: unknown;
    status?: number;
  };
  request?: unknown;
  message?: string;
}

export const getProducts = async (
  page = 1,
  size = 10
): Promise<PaginatedProductsResponse> => {
  try {
    const response = await api.get(`/products`, {
      //params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (
  productData: ProductFormData
): Promise<Product> => {
  try {
    const response = await api.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  productData: Partial<ProductFormData>
): Promise<Product> => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

export const uploadProductImage = async (
  file: File
): Promise<ProductUploadImageResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    for (const pair of formData.entries()) {
      console.log("[DEBUG] FormData:", pair[0], pair[1]);
    }

    const response = await api.post("/products/upload-image", formData);

    // Verificar si la respuesta tiene la estructura esperada
    if (response.data && typeof response.data === "object") {
      return response.data;
    } else {
      throw new Error("Respuesta inesperada del servidor");
    }
  } catch (error: unknown) {
    console.error("Error uploading image:", error);

    // Manejar diferentes tipos de errores
    if (error && typeof error === "object" && "response" in error) {
      // Error de respuesta del servidor
      const axiosError = error as AxiosError;
      const serverError = axiosError.response?.data as
        | { message?: string }
        | undefined;
      if (serverError && serverError.message) {
        throw new Error(serverError.message);
      } else if (axiosError.response?.status === 400) {
        throw new Error("Archivo no válido o faltante");
      } else if (axiosError.response?.status === 413) {
        throw new Error("Archivo demasiado grande");
      } else if (
        axiosError.response?.status &&
        axiosError.response.status >= 500
      ) {
        throw new Error("Error interno del servidor");
      } else {
        throw new Error(
          `Error del servidor: ${axiosError.response?.status || "Desconocido"}`
        );
      }
    } else if (error && typeof error === "object" && "request" in error) {
      // Error de red
      throw new Error("Error de conexión. Verifica tu internet.");
    } else {
      // Error del cliente
      const errorMessage =
        error instanceof Error ? error.message : "Error al subir la imagen";
      throw new Error(errorMessage);
    }
  }
};

export const productService = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};
