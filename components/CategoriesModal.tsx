"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCategoryStore } from "@/store/categories";
import { useProductsStore } from "@/store/products";
import { Category, Product } from "@/types/api";
import Image from "next/image";
import Link from "next/link";

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategoriesModal({ isOpen, onClose }: CategoriesModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const { categories, fetchCategories } = useCategoryStore();
  const { products: allProducts, fetchProducts } = useProductsStore();

  // Cargar categorías y productos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      if (categories.length === 0) {
        fetchCategories();
      }
      if (allProducts.length === 0) {
        fetchProducts(1, 100); // Cargar más productos para tener variedad
      }
    }
  }, [isOpen, categories.length, allProducts.length, fetchCategories, fetchProducts]);

  useEffect(() => {
    if (selectedCategory) {
      const categoryProducts = allProducts.filter(product => {
        if (product.CategoryProduct && Array.isArray(product.CategoryProduct)) {
          return product.CategoryProduct.some(cat => cat.categoryId === selectedCategory.id);
        }
        return false;
      });
      
      setProducts(categoryProducts.slice(0, 12));
    }
  }, [selectedCategory, allProducts]);

  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-xl sm:rounded-xl w-full max-w-6xl h-[90vh] sm:h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-xl sm:text-2xl font-bold">Categorías</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-full sm:w-1/5 border-b sm:border-b-0 sm:border-r bg-gray-50 overflow-y-auto max-h-32 sm:max-h-none">
            <div className="p-2 sm:p-4">
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex-shrink-0 sm:w-full text-left md:p-2 p-3 rounded-lg transition-colors text-sm ${
                      selectedCategory?.id === category.id
                        ? "bg-magenta text-white"
                        : "hover:bg-gray-200 whitespace-nowrap sm:whitespace-normal"
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            {selectedCategory && (
              <>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                  {selectedCategory.name}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/producto/${product.id}`}
                      onClick={onClose}
                      className="bg-white h-full rounded-lg p-2 sm:p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-square relative mb-2 sm:mb-3 bg-gray-50 rounded-md overflow-hidden">
                        <Image
                          src={product.images?.[0]?.url || "/placeholder.jpg"}
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h4 className="font-medium text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-magenta font-bold text-sm sm:text-base">
                        {formatPrice(product.sellingPrice)}
                      </p>
                    </Link>
                  ))}
                </div>
                {products.length === 0 && (
                  <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">
                    No hay productos disponibles en esta categoría
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}