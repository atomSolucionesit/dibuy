"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Heart, ShoppingCart, Filter, Grid, List } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/contexts/CartContext"
//import { products } from "@/data/products"
import { productService } from "@/api/products/catalogo/productService"
import { Product } from "@/types/api"


export default function ProductsPage() {
  const { addItem } = useCart()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProductos] = useState<Product[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<Product[]>([]);

  const categories = [
  { id: "all", name: "Todos los productos", count: products.length },
  { id: "smartphones", name: "Smartphones", count: products.filter((p) => p.category === "smartphones").length },
  { id: "laptops", name: "Laptops", count: products.filter((p) => p.category === "laptops").length },
  { id: "tablets", name: "Tablets", count: products.filter((p) => p.category === "tablets").length },
  { id: "accesorios", name: "Accesorios", count: products.filter((p) => p.category === "accesorios").length },
  { id: "gaming", name: "Gaming", count: products.filter((p) => p.category === "gaming").length },
]

const sortOptions = [
  { id: "featured", name: "Destacados" },
  { id: "price-low", name: "Precio: Menor a Mayor" },
  { id: "price-high", name: "Precio: Mayor a Menor" },
  { id: "rating", name: "Mejor Valorados" },
  { id: "newest", name: "Más Nuevos" },
]

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
  console.log("Productos actualizados:", products);
}, [products]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const productsResponse = await productService.getProducts(1, 10);
      setProductos(productsResponse.info.data);
      //setTotalPages(productsResponse.info.meta.pages);
      //setTotalItems(productsResponse.info.meta.total);
    } catch (error) {
      console.error("Error fetching products:", error);
      window.Error("Error al cargar los productos");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const filteredProducts = products.filter(
    (product) => selectedCategory === "all" || product.category === selectedCategory,
  )

  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id - a.id
      default:
        return 0
    }
  })

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
            <span className="badge-oro text-negro mb-4 inline-block">🛍️ Productos</span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Todos los productos</h1>
            <p className="text-lg opacity-90">Descubre nuestra amplia selección de tecnología</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-blanco rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-4 text-negro">Categorías</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id 
                          ? "bg-magenta text-blanco shadow-md" 
                          : "hover:bg-magenta/10 hover:text-magenta"
                      }`}
                    >
                      <span className="flex justify-between">
                        <span>{category.name}</span>
                        <span className={`text-sm ${selectedCategory === category.id ? 'opacity-75' : 'opacity-60'}`}>
                          ({category.count})
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
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
                  <span className="text-gray-600">{sortedProducts.length} productos encontrados</span>
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
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className={`bg-blanco rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-magenta/20 ${
                    viewMode === "list" ? "flex gap-6 p-6" : "p-4"
                  }`}
                >
                  <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "mb-4"}`}>
                    {product.badge && (
                      <span
                        className={`absolute top-2 left-2 px-3 py-1 text-xs font-medium rounded-full z-10 ${
                          product.badge === "Nuevo"
                            ? "badge-magenta"
                            : product.badge === "Bestseller"
                              ? "badge-zafiro"
                              : product.badge === "Oferta"
                                ? "badge-oro"
                                : "badge-amatista"
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
                        src={product.images[0].url}
                        alt={product.name}
                        width={400}
                        height={400}
                        className={`w-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300 ${
                          viewMode === "list" ? "h-32" : "h-48"
                        }`}
                      />
                    </Link>
                  </div>

                  <div className={`space-y-3 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <Link href={`/producto/${product.id}`}>
                      <h3 className="font-semibold hover:text-magenta transition-colors text-negro">{product.name}</h3>
                    </Link>

                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? "text-oro fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>

                    {viewMode === "list" && <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>}

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-magenta">{formatPrice(product.sellingPrice)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      {product.originalPrice && (
                        <span className="text-sm text-green-600 font-medium">
                          💰 Ahorrás {formatPrice(product.originalPrice - product.price)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => addItem(product)}
                      className="group relative overflow-hidden w-full bg-gradient-primary text-blanco px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 mt-4"
                    >
                      <span className="relative z-10 flex items-center space-x-2">
                        <ShoppingCart className="h-4 w-4" />
                        <span>🛒 Agregar al carrito</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blanco/0 via-blanco/10 to-blanco/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}
