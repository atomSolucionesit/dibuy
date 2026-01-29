"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
//import { products } from "@/data/products"
import { ProductService } from "@/services/productService";
import { Product } from "@/types/api";
import { useState, useEffect } from "react";

export default function FeaturedProducts() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProductos] = useState<Product[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const productsResponse = await ProductService.getProducts(1, 10);
      setProductos(productsResponse.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-magenta/25 to-zafiro/15">
      <div className="container mx-auto md:px-4">
        <div className="text-center mb-12">
          <span className="badge-magenta mb-4 inline-block">
            ⭐ Productos destacados
          </span>
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-negro">
            Los productos más populares
          </h2>
          <p className="text-gray-600 text-lg">
            Los productos más populares y mejor valorados por nuestros clientes
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
          {products.map((product) => (
            <div key={product.id} className="card-product group">
              <div className="relative mb-4 p-4">
                {product.badge && (
                  <span
                    className={`absolute top-2 left-2 px-3 py-1 text-xs font-medium rounded-full z-10 ${
                      product.badge === "Nuevo"
                        ? "badge-magenta"
                        : product.badge === "Bestseller"
                          ? "badge-zafiro"
                          : "badge-oro"
                    }`}
                  >
                    {product.badge}
                  </span>
                )}
                <button className="absolute top-2 right-2 p-2 bg-blanco rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-magenta hover:text-blanco">
                  <Heart className="h-4 w-4" />
                </button>
                <Link href={`/producto/${product.id}`}>
                  <Image
                    src={product?.images[0]?.url || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-48 object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              </div>

              <div className="space-y-3">
                <Link href={`/producto/${product.id}`}>
                  <h3 className="text-xs md:text-lg font-semibold hover:text-magenta transition-colors text-negro">
                    {product.name}
                  </h3>
                </Link>

                <div className="space-y-1">
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
                  className="group relative overflow-hidden w-full bg-gradient-primary text-blanco px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 mt-4"
                >
                  <span className="relative z-10 flex items-center md:space-x-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-xs md:text-lg">
                      Agregar al carrito
                    </span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blanco/0 via-blanco/10 to-blanco/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/productos"
            className="group relative overflow-hidden border-2 border-magenta text-magenta px-8 py-4 rounded-lg font-medium hover:bg-magenta hover:text-blanco transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">📦 Ver todos los productos</span>
            <div className="absolute inset-0 bg-magenta -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          </Link>
        </div>
      </div>
    </section>
  );
}
