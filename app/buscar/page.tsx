"use client";

import React, { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Heart,
  ShoppingCart,
  Filter,
  Grid,
  List,
  Search,
  X,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { searchProducts, products } from "@/data/products";

const sortOptions = [
  { id: "featured", name: "Destacados" },
  { id: "price-low", name: "Precio: Menor a Mayor" },
  { id: "price-high", name: "Precio: Mayor a Menor" },
  { id: "rating", name: "Mejor Valorados" },
  { id: "newest", name: "Más Nuevos" },
];

const priceRanges = [
  { id: "all", name: "Todos los precios" },
  { id: "0-100000", name: "Hasta $100.000" },
  { id: "100000-500000", name: "$100.000 - $500.000" },
  { id: "500000-1000000", name: "$500.000 - $1.000.000" },
  { id: "1000000+", name: "Más de $1.000.000" },
];

const brands = ["Apple", "Samsung", "Sony"];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand =
      selectedBrand === "all" || product.brand === selectedBrand;
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    let matchesPrice = true;
    if (selectedPriceRange !== "all") {
      const [min, max] = selectedPriceRange.split("-").map(Number);
      if (selectedPriceRange === "1000000+") {
        matchesPrice = product.price >= 1000000;
      } else {
        matchesPrice = product.price >= min && product.price <= max;
      }
    }

    return matchesSearch && matchesBrand && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Buscar productos
            </h1>
            <p className="text-lg opacity-90">
              Encuentra exactamente lo que necesitas
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
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
              {/* Search */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Búsqueda</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Categorías</h3>
                <div className="space-y-2">
                  {[
                    "all",
                    "smartphones",
                    "laptops",
                    "tablets",
                    "accesorios",
                    "gaming",
                  ].map((category) => (
                    <label
                      key={category}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedCategory(e.target.value)}
                        className="text-primary"
                      />
                      <span className="capitalize">
                        {category === "all" ? "Todas las categorías" : category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Brands */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Marcas</h3>
                <div className="space-y-2">
                  {["all", ...brands].map((brand) => (
                    <label key={brand} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="brand"
                        value={brand}
                        checked={selectedBrand === brand}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedBrand(e.target.value)}
                        className="text-primary"
                      />
                      <span>
                        {brand === "all" ? "Todas las marcas" : brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Rango de precio</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label
                      key={range.id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.id}
                        checked={selectedPriceRange === range.id}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedPriceRange(e.target.value)}
                        className="text-primary"
                      />
                      <span>{range.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedBrand("all");
                  setSelectedCategory("all");
                  setSelectedPriceRange("all");
                }}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-primary border border-gray-300 rounded-lg hover:border-primary transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </aside>
          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
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
                      className={`p-2 ${
                        viewMode === "grid"
                          ? "bg-primary text-white"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 ${
                        viewMode === "list"
                          ? "bg-primary text-white"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Results */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600 mb-6">
                  Intenta ajustar tus filtros de búsqueda
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedBrand("all");
                    setSelectedCategory("all");
                    setSelectedPriceRange("all");
                  }}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {sortedProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ${
                      viewMode === "list" ? "flex gap-6 p-6" : "p-4"
                    }`}
                  >
                    <div
                      className={`relative ${
                        viewMode === "list" ? "w-48 flex-shrink-0" : "mb-4"
                      }`}
                    >
                      {product.badge && (
                        <span
                          className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full z-10 ${
                            product.badge === "Nuevo"
                              ? "bg-primary text-white"
                              : product.badge === "Bestseller"
                              ? "bg-secondary text-white"
                              : product.badge === "Oferta"
                              ? "bg-red-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {product.badge}
                        </span>
                      )}
                      <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Heart className="h-4 w-4" />
                      </button>
                      <Link href={`/producto/${product.id}`}>
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={400}
                          height={400}
                          className={`w-full object-cover rounded-lg ${
                            viewMode === "list" ? "h-32" : "h-48"
                          }`}
                        />
                      </Link>
                    </div>
                    <div
                      className={`space-y-2 ${
                        viewMode === "list" ? "flex-1" : ""
                      }`}
                    >
                      <Link href={`/producto/${product.id}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray">
                          ({product.reviews})
                        </span>
                      </div>
                      {viewMode === "list" && (
                        <p className="text-gray text-sm line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-primary">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        {product.originalPrice && (
                          <span className="text-sm text-green-600 font-medium">
                            Ahorrás{" "}
                            {formatPrice(product.originalPrice - product.price)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => addItem(product)}
                        className="group relative overflow-hidden w-full bg-gradient-primary text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 mt-4"
                      >
                        <span className="relative z-10 flex items-center space-x-2">
                          <ShoppingCart className="h-4 w-4" />
                          <span>Agregar al carrito</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Cargando búsqueda...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
