"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ProductService } from "@/services/productService";
import { Category } from "@/types/api";

const defaultIcons = ["📱", "💻", "🎧", "🎮", "🔊", "⌚"];
const colors = ["magenta", "zafiro", "amatista", "oro"];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await ProductService.getCategories();
        setCategories(categoriesData.slice(0, 6));
      } catch (error) {
        console.error("Error loading categories:", error);
        // Fallback a categorías por defecto si falla
        setCategories([
          { id: "1", name: "Smartphones", slug: "smartphones" },
          { id: "2", name: "Laptops", slug: "laptops" },
          { id: "3", name: "Tablets", slug: "tablets" },
          { id: "4", name: "Accesorios", slug: "accesorios" },
          { id: "5", name: "Gaming", slug: "gaming" },
          { id: "6", name: "Audio", slug: "audio" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);
  const getColorClasses = (color: string) => {
    switch (color) {
      case "magenta":
        return "hover:border-magenta hover:bg-magenta/5 group-hover:text-magenta";
      case "zafiro":
        return "hover:border-zafiro hover:bg-zafiro/5 group-hover:text-zafiro";
      case "amatista":
        return "hover:border-amatista hover:bg-amatista/5 group-hover:text-amatista";
      case "oro":
        return "hover:border-oro hover:bg-oro/5 group-hover:text-oro";
      default:
        return "hover:border-magenta hover:bg-magenta/5 group-hover:text-magenta";
    }
  };

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blanco to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="badge-zafiro mb-4 inline-block">🏷️ Categorías</span>
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-negro">
            Explora por categorías
          </h2>
          <p className="text-gray-600 text-lg">
            Encuentra exactamente lo que buscas en nuestra amplia selección
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-blanco rounded-xl p-4 md:p-6 text-center animate-pulse"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category, index) => {
              const color = colors[index % colors.length];
              const icon = defaultIcons[index % defaultIcons.length];
              return (
                <Link
                  key={category.id}
                  href={`/categoria/${
                    category.slug || category.name.toLowerCase()
                  }`}
                  className={`group bg-blanco rounded-xl p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent ${getColorClasses(
                    color
                  )}`}
                >
                  <div className="mb-4 relative">
                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl md:text-3xl">
                      {icon}
                    </div>
                    <div
                      className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${
                        color === "magenta"
                          ? "bg-magenta"
                          : color === "zafiro"
                          ? "bg-zafiro"
                          : color === "amatista"
                          ? "bg-amatista"
                          : "bg-oro"
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    ></div>
                  </div>
                  <h3 className="font-semibold text-sm md:text-base mb-1 transition-colors text-negro">
                    {category.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    {category.productCount
                      ? `${category.productCount} productos`
                      : "Ver productos"}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No se pudieron cargar las categorías
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
