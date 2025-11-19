"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useProductsStore } from "@/store/products";
import { useCategoryStore } from "@/store/categories";
import { ProductService } from "@/services/productService";
import { Product, Category } from "@/types/api";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { categories: allCategories, fetchCategories } = useCategoryStore();
  const { products, fetchProducts } = useProductsStore();

  useEffect(() => {
    // Cargar datos si no están disponibles
    if (allCategories.length === 0) {
      fetchCategories();
    }
    if (products.length === 0) {
      fetchProducts();
    }
  }, [allCategories.length, products.length, fetchCategories, fetchProducts]);

  useEffect(() => {
    setCategories(allCategories.slice(0, 6));
  }, [allCategories]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchProducts = async () => {
      setIsLoading(true);
      try {
        const searchResults = await ProductService.searchProducts(query);
        setResults(searchResults.slice(0, 8));
      } catch (error) {
        console.error('Error searching products:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 bg-white">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="sr-only">Buscar productos</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/20 text-negro"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-96">
          {query.length === 0 && (
            <div className="p-4">
              <h3 className="font-semibold mb-3 text-negro">Categorías</h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => {
                      onClose();
                      router.push(`/productos?categoria=${category.id}`);
                    }}
                    className="p-3 rounded-lg border border-gray-200 hover:border-magenta/30 hover:bg-magenta/5 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-magenta mx-auto"></div>
            </div>
          )}

          {query.length > 0 && !isLoading && results.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No se encontraron productos
            </div>
          )}

          {results.length > 0 && (
            <div className="p-4">
              <h3 className="font-semibold mb-3 text-negro">Productos</h3>
              <div className="space-y-2">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onClose();
                      router.push(`/producto/${product.id}`);
                    }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Image
                      src={product.images[0]?.url || "/placeholder.svg"}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="rounded-lg object-contain bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-negro truncate">
                        {product.name}
                      </h4>
                      <p className="text-magenta font-semibold text-sm">
                        {formatPrice(product.sellingPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}