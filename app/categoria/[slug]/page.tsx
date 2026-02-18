"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingCart, Filter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProductService } from "@/services/productService";
import { Product } from "@/types/api";
import { useCart } from "@/contexts/CartContext";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    const loadCategoryProducts = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          ProductService.getProductsByCategory(slug),
          ProductService.getPublishedCategories()
        ]);
        
        setProducts(productsResponse.data || []);
        
        // Buscar el nombre real de la categoría
        const category = categoriesResponse?.find(cat => cat.id === slug);
        setCategoryName(category?.name || decodeURIComponent(slug).replace(/-/g, " ").toUpperCase());
      } catch (error) {
        console.error("Error loading category products:", error);
        setProducts([]);
        setCategoryName(decodeURIComponent(slug).replace(/-/g, " ").toUpperCase());
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadCategoryProducts();
    }
  }, [slug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {categoryName}
            </h1>
            <p className="text-lg opacity-90">
              {products.length} productos encontrados
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto md:px-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
              {products.map((product) => (
                <div key={product.id} className="card-product group bg-white flex flex-col h-full">
                  <div className="relative mb-4">
                    {product.badge && (
                      <span className="absolute top-2 left-2 px-3 py-1 text-xs font-medium rounded-full z-10 badge-magenta">
                        {product.badge}
                      </span>
                    )}
                    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-magenta hover:text-white">
                      <Heart className="h-4 w-4" />
                    </button>
                    <Link href={`/producto/${product.id}`}>
                      <Image
                        src={product.images[0]?.url || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>

                  <div className="flex flex-col flex-1">
                    <Link href={`/producto/${product.id}`}>
                      <h3 className="text-xs md:text-lg font-semibold hover:text-magenta transition-colors text-negro mb-3 line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex-1 flex flex-col justify-end">
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-magenta">
                            {formatPrice(product.sellingPrice)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        {product.originalPrice && (
                          <span className="text-sm text-green-600 font-medium">
                            💰 Ahorrás{" "}
                            {formatPrice(
                              product.originalPrice - product.sellingPrice,
                            )}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => addItem(product)}
                        className="group relative overflow-hidden w-full bg-gradient-primary text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                      >
                        <span className="relative z-10 flex items-center rounded-md md:rounded-none md:space-x-2">
                          <ShoppingCart className="h-4 w-4" />
                          <span className="text-xs md:text-md">
                            Agregar al carrito
                          </span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <Filter className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No hay productos en esta categoría
                </h3>
                <p className="text-gray-600 mb-6">
                  No se encontraron productos para la categoría "{categoryName}
                  ".
                </p>
                <Link
                  href="/"
                  className="inline-block bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
