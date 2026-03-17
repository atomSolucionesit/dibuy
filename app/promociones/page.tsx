"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Filter, Grid, List, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { ProductService } from "@/services/productService";
import { Product } from "@/types/api";

export default function PromotionsPage() {
  const { addItem } = useCart();
  const [promotions, setPromotions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

  const sortOptions = [
    { id: "featured", name: "Destacadas" },
    { id: "price-low", name: "Precio: Menor a Mayor" },
    { id: "price-high", name: "Precio: Mayor a Menor" },
    { id: "name", name: "Nombre" },
  ];

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        setIsLoading(true);
        const data = await ProductService.getPromotionCatalog();
        setPromotions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching promotions:", error);
        setPromotions([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPromotions();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredPromotions = useMemo(() => {
    return promotions.filter(
      (promotion) =>
        promotion.sellingPrice >= priceRange[0] &&
        promotion.sellingPrice <= priceRange[1],
    );
  }, [promotions, priceRange]);

  const sortedPromotions = useMemo(() => {
    const items = [...filteredPromotions];

    items.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.sellingPrice - b.sellingPrice;
        case "price-high":
          return b.sellingPrice - a.sellingPrice;
        case "name":
          return a.name.localeCompare(b.name, "es");
        default:
          return 0;
      }
    });

    return items;
  }, [filteredPromotions, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blanco to-gray-50">
      <Header />

      <section className="bg-gradient-primary text-blanco py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-magenta/20 via-transparent to-zafiro/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-oro/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">PROMOS!!!</h1>
            <p className="text-lg opacity-90">
              Todas las promociones activas de Dibuy en un solo lugar
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-blanco rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-4 text-negro">Promociones</h3>
              <div className="rounded-lg bg-magenta text-blanco px-4 py-3 shadow-md font-semibold">
                PROMOS!!!
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Acá se listan únicamente combos y promociones activas.
              </p>
            </div>

            <div className="bg-blanco rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
              <h3 className="font-semibold text-lg mb-4 text-negro">
                Filtrar por precio
              </h3>
              <div className="flex justify-between text-sm mb-2">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
              <div className="relative h-6">
                <input
                  type="range"
                  min={0}
                  max={10000000}
                  step={500}
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="absolute w-full pointer-events-none appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-magenta [&::-webkit-slider-thumb]:cursor-pointer"
                  style={{
                    background: `linear-gradient(
                      to right,
                      #d1d5db ${(priceRange[0] / 10000000) * 100}%,
                      #e6007e ${(priceRange[0] / 10000000) * 100}%,
                      #e6007e ${(priceRange[1] / 10000000) * 100}%,
                      #d1d5db ${(priceRange[1] / 10000000) * 100}%
                    )`,
                    height: "6px",
                    borderRadius: "9999px",
                  }}
                />

                <input
                  type="range"
                  min={0}
                  max={10000000}
                  step={500}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-magenta [&::-webkit-slider-thumb]:cursor-pointer"
                  style={{ height: "6px" }}
                />
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="bg-blanco rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-magenta/10 hover:border-magenta transition-colors"
                  >
                    <Filter className="h-4 w-4" />
                    Filtros
                  </button>
                  <span className="text-gray-600">
                    {sortedPromotions.length} promociones encontradas
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/20 transition-all"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>

                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 transition-colors ${
                        viewMode === "grid"
                          ? "bg-magenta text-blanco"
                          : "hover:bg-magenta/10 hover:text-magenta"
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 transition-colors ${
                        viewMode === "list"
                          ? "bg-magenta text-blanco"
                          : "hover:bg-magenta/10 hover:text-magenta"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-blanco rounded-2xl p-4 shadow-sm animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                    <div className="space-y-3">
                      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-200 h-6 rounded w-1/3"></div>
                      <div className="bg-gray-200 h-10 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedPromotions.length === 0 ? (
              <div className="bg-blanco rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500 shadow-sm">
                No hay promociones activas en este momento.
              </div>
            ) : (
              <div
                className={`grid gap-4 md:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {sortedPromotions.map((promotion) => (
                  <div
                    key={promotion.id}
                    className={`group bg-blanco rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-magenta/30 overflow-hidden backdrop-blur-sm ${
                      viewMode === "list"
                        ? "flex gap-6 p-6 hover:bg-gradient-to-r hover:from-blanco hover:to-magenta/5"
                        : "p-3 md:p-4 hover:-translate-y-2 hover:bg-gradient-to-b hover:from-blanco hover:to-magenta/5"
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden ${
                        viewMode === "list"
                          ? "w-32 md:w-48 flex-shrink-0"
                          : "mb-3 md:mb-4"
                      }`}
                    >
                      <span className="absolute top-2 left-2 px-2 md:px-3 py-1 text-xs font-semibold rounded-full z-10 backdrop-blur-sm shadow-lg bg-amatista/90 text-blanco">
                        PROMO
                      </span>
                      <Link href={`/producto/${promotion.id}`} className="block">
                        <div className="relative overflow-hidden rounded-xl bg-white p-4">
                          <Image
                            src={promotion.images[0]?.url || "/placeholder.svg"}
                            alt={promotion.name}
                            width={400}
                            height={400}
                            className={`w-full object-contain group-hover:scale-110 transition-transform duration-500 ${
                              viewMode === "list"
                                ? "h-24 md:h-32"
                                : "h-40 md:h-48 lg:h-56"
                            }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-negro/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </Link>
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amatista">
                          <Tag className="h-3.5 w-3.5" />
                          Combo promocional
                        </div>

                        <Link href={`/producto/${promotion.id}`}>
                          <h3
                            className={`font-semibold text-negro line-clamp-2 hover:text-magenta transition-colors ${
                              viewMode === "list"
                                ? "text-base md:text-lg"
                                : "text-sm md:text-base"
                            }`}
                          >
                            {promotion.name}
                          </h3>
                        </Link>

                        <p className="text-sm text-gray-600 line-clamp-2">
                          {promotion.description}
                        </p>

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`font-bold text-magenta ${
                                viewMode === "list"
                                  ? "text-xl md:text-2xl"
                                  : "text-lg md:text-xl"
                              }`}
                            >
                              {formatPrice(promotion.sellingPrice)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => addItem(promotion)}
                        className={`group/btn relative overflow-hidden w-full bg-gradient-to-r from-magenta to-zafiro text-blanco font-semibold rounded-xl hover:from-zafiro hover:to-magenta transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 ${
                          viewMode === "list"
                            ? "px-6 py-3 text-base"
                            : "px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm"
                        } mt-3 md:mt-4`}
                      >
                        <span className="relative z-10 flex items-center space-x-1 md:space-x-2">
                          <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="hidden sm:inline">Agregar</span>
                          <span className="sm:hidden">+</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blanco/0 via-blanco/20 to-blanco/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
