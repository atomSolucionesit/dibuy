"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductService } from "@/services/productService";
import { Category } from "@/types/api";

const defaultIcons = ["📱", "💻", "🎧", "🎮", "🔊", "⌚"];
const colors = ["magenta", "zafiro", "amatista", "oro"];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const isMobile = useIsMobile();
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Determine items per slide based on screen size
  useEffect(() => {
    if (typeof isMobile === "undefined") return;
    
    const updateItemsPerSlide = () => {
      if (isMobile) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(3);
      }
    };

    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, [isMobile]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await ProductService.getPublishedCategories();
        setCategories(categoriesData.slice(0, 6));
        setCurrentSlide(0);
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

  const totalSlides = Math.ceil(categories.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const visibleCategories = categories.slice(
    currentSlide * itemsPerSlide,
    (currentSlide + 1) * itemsPerSlide
  );

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-zafiro/60 to-magenta/25">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {/* <span className="badge-zafiro mb-4 inline-block">🏷️ Categorías</span> */}
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-negro">
            Explora por categorías
          </h2>
          <p className="text-gray-600 text-lg">
            Encuentra exactamente lo que buscas en nuestra amplia selección
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
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
          <div className="relative">
            {/* Carousel Container */}
            <div
              ref={carouselRef}
              className="flex justify-center px-4 md:px-12"
            >
              <div className="w-full max-w-6xl">
                {/* Items Grid - shows only current slide items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {visibleCategories.map((category, index) => {
                    const globalIndex =
                      currentSlide * itemsPerSlide + index;
                    const color = colors[globalIndex % colors.length];
                    const icon = defaultIcons[globalIndex % defaultIcons.length];
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
                          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-lg flex items-center justify-center text-2xl md:text-3xl">
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
                          Ver productos
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            {totalSlides > 1 && (
              <>
                {/* Arrows */}
                <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center px-2 pointer-events-none">
                  <button
                    onClick={prevSlide}
                    className="pointer-events-auto p-2 bg-blanco/80 backdrop-blur-sm hover:bg-blanco border border-blanco/20 rounded-full text-negro/60 hover:text-negro transition-all duration-300 shadow-lg hidden md:flex"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="pointer-events-auto p-2 bg-blanco/80 backdrop-blur-sm hover:bg-blanco border border-blanco/20 rounded-full text-negro/60 hover:text-negro transition-all duration-300 shadow-lg hidden md:flex"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Indicators (dots) */}
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-magenta w-8"
                          : "bg-magenta/30 hover:bg-magenta/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
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
