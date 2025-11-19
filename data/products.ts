import { Product } from "@/types/api";

export const products: Product[] = [];

export const getProductsByCategory = (category: string) => {
  return products.filter((product) => product.category === category);
};

export const getProductById = (id: string) => {
  return products.find((product) => product.id === id);
};

export const searchProducts = (query: string) => {
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
  );
};
