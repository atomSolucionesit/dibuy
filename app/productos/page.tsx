"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingCart, Filter, Grid, List } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useProductsStore } from "@/store/products";
import { useCategoryStore } from "@/store/categories";

function ProductsPageContent() {
  const { addItem } = useCart();
  const { products, isLoading, fetchProducts } = useProductsStore();
  const { categories, fetchCategories } = useCategoryStore();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  const sortOptions = [
    { id: "featured", name: "Destacados" },
    { id: "price-low", name: "Precio: Menor a Mayor" },
    { id: "price-high", name: "Precio: Mayor a Menor" },
    { id: "rating", name: "Mejor Valorados" },
    { id: "newest", name: "Más Nuevos" },
  ];

  useEffect(() => {
    fetchCategories();
    
    // Obtener categoría de la URL
    const categoryFromUrl = searchParams.get('categoria');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      fetchProducts(1, 20, categoryFromUrl);
    } else {
      setSelectedCategory('all');
      fetchProducts(1, 20);
    }
  }, [fetchProducts, fetchCategories, searchParams]);

  useEffect(() => {
    console.log("Productos actualizados:", products);
    console.log("Categorias: ", categories);
  }, [products]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredProducts = products.filter((product) => {
    const inPriceRange =
      product.sellingPrice >= priceRange[0] &&
      product.sellingPrice <= priceRange[1];

    return inPriceRange;
  });

  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    switch (sortBy) {
      case "price-low":
        return a.sellingPrice - b.sellingPrice;
      case "price-high":
        return b.sellingPrice - a.sellingPrice;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blanco to-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-primary text-blanco py-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-magenta/20 via-transparent to-zafiro/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-oro/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <span className="badge-oro text-negro mb-4 inline-block">
              🛍️ Productos
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Todos los productos
            </h1>
            <p className="text-lg opacity-90">
              Descubre nuestra amplia selección de tecnología
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            {/* Filtro por categorias */}
            <div className="bg-blanco rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-4 text-negro">
                Categorías
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      fetchProducts(1, 20);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === "all"
                        ? "bg-magenta text-blanco shadow-md"
                        : "hover:bg-magenta/10 hover:text-magenta"
                    }`}
                  >
                    <span className="flex justify-between">
                      <span>Todos</span>
                    </span>
                  </button>
                </li>
                {categories.map((category) => {
                  return (
                    <li key={category.id}>
                      <button
                        onClick={() => {
                          setSelectedCategory(category.id);
                          fetchProducts(1, 20, category.id);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? "bg-magenta text-blanco shadow-md"
                            : "hover:bg-magenta/10 hover:text-magenta"
                        }`}
                      >
                        <span className="flex justify-between">
                          <span>{category.name}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* Filtro por precio */}
            <div className="bg-blanco rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
              <h3 className="font-semibold text-lg mb-4 text-negro">
                Filtrar por precio
              </h3>
              <div className="flex justify-between text-sm mb-2">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
              {/* Slider doble */}
              <div className="relative h-6">
                <input
                  type="range"
                  min={0}
                  max={1000000}
                  step={500}
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="absolute w-full pointer-events-none appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-magenta [&::-webkit-slider-thumb]:cursor-pointer"
                  style={{
                    background: `linear-gradient(
                      to right,
                      #d1d5db ${(priceRange[0] / 1000000) * 100}%,
                      #e6007e ${(priceRange[0] / 1000000) * 100}%,
                      #e6007e ${(priceRange[1] / 1000000) * 100}%,
                      #d1d5db ${(priceRange[1] / 1000000) * 100}%
                    )`,
                    height: "6px",
                    borderRadius: "9999px",
                  }}
                />

                <input
                  type="range"
                  min={0}
                  max={1000000}
                  step={500}
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="absolute w-full pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-magenta [&::-webkit-slider-thumb]:cursor-pointer"
                  style={{
                    height: "6px",
                  }}
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
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
                    {sortedProducts.length} productos encontrados
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

            {/* Products Grid */}
            {/* Loading State */}
            {isLoading ? (
              <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-blanco rounded-2xl p-4 shadow-sm animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                    <div className="space-y-3">
                      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                      <div className="bg-gray-200 h-6 rounded w-1/3"></div>
                      <div className="bg-gray-200 h-10 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`grid gap-4 md:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className={`group bg-blanco rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-magenta/30 overflow-hidden backdrop-blur-sm ${
                    viewMode === "list" 
                      ? "flex gap-6 p-6 hover:bg-gradient-to-r hover:from-blanco hover:to-magenta/5" 
                      : "p-3 md:p-4 hover:-translate-y-2 hover:bg-gradient-to-b hover:from-blanco hover:to-magenta/5"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "list" ? "w-32 md:w-48 flex-shrink-0" : "mb-3 md:mb-4"
                    }`}
                  >
                    {product.badge && (
                      <span
                        className={`absolute top-2 left-2 px-2 md:px-3 py-1 text-xs font-semibold rounded-full z-10 backdrop-blur-sm shadow-lg ${
                          product.badge === "Nuevo"
                            ? "bg-magenta/90 text-blanco"
                            : product.badge === "Bestseller"
                            ? "bg-zafiro/90 text-blanco"
                            : product.badge === "Oferta"
                            ? "bg-oro/90 text-negro"
                            : "bg-amatista/90 text-blanco"
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                    <button className="absolute top-2 right-2 p-1.5 md:p-2 bg-blanco/80 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hover:bg-magenta hover:text-blanco hover:scale-110">
                      <Heart className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                    <Link href={`/producto/${product.id}`} className="block">
                      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                        <Image
                          src={product.images[0]?.url || '/placeholder.svg'}
                          alt={product.name}
                          width={400}
                          height={400}
                          className={`w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ${
                            viewMode === "list" ? "h-24 md:h-32" : "h-40 md:h-48 lg:h-56"
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-negro/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </Link>
                  </div>

                  <div
                    className={`flex flex-col justify-between ${
                      viewMode === "list" ? "flex-1" : "flex-1"
                    }`}
                  >
                    <div className="space-y-2 md:space-y-3">
                      <Link href={`/producto/${product.id}`}>
                        <h3 className={`font-semibold hover:text-magenta transition-colors text-negro line-clamp-2 ${
                          viewMode === "list" ? "text-base md:text-lg" : "text-sm md:text-base"
                        }`}>
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 md:h-4 md:w-4 ${
                                i < Math.floor(product.rating || 0)
                                  ? "text-oro fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs md:text-sm text-gray-600">
                          ({product.reviews || 0})
                        </span>
                      </div>

                      {viewMode === "list" && (
                        <p className="text-gray-600 text-sm md:text-base line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold text-magenta ${
                            viewMode === "list" ? "text-xl md:text-2xl" : "text-lg md:text-xl"
                          }`}>
                            {formatPrice(product.sellingPrice)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.sellingPrice && (
                            <span className="text-xs md:text-sm text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        {product.originalPrice && product.originalPrice > product.sellingPrice && (
                          <div className="flex items-center space-x-1">
                            <span className="text-xs md:text-sm text-green-600 font-medium">
                              💰 Ahorrás {formatPrice(product.originalPrice - product.sellingPrice)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => addItem(product)}
                      className={`group/btn relative overflow-hidden w-full bg-gradient-to-r from-magenta to-zafiro text-blanco font-semibold rounded-xl hover:from-zafiro hover:to-magenta transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 ${
                        viewMode === "list" ? "px-6 py-3 text-base" : "px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm"
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
            
            {/* Empty State */}
            {!isLoading && sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-gradient-to-br from-magenta/10 to-zafiro/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <ShoppingCart className="h-12 w-12 text-magenta" />
                </div>
                <h3 className="text-xl font-semibold text-negro mb-2">No se encontraron productos</h3>
                <p className="text-gray-600 mb-6">Intenta ajustar los filtros o buscar otros términos</p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange([0, 1000000]);
                  }}
                  className="bg-gradient-to-r from-magenta to-zafiro text-blanco px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-magenta"></div></div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
