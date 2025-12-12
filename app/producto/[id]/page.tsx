"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Heart, ShoppingCart, Minus, Plus, Truck, RotateCcw } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/contexts/CartContext"
import { useProductsStore } from "@/store/products"
import { ProductService } from "@/services/productService"
import { Product, Brand } from "@/types/api"

export default function ProductPage() {
  const params = useParams()

  const { addItem } = useCart()
  const { products, isLoading, fetchProducts } = useProductsStore()

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProducto] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brand, setBrand] = useState<string | null>("hola");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await ProductService.getProductById(params.id as string);
      setProducto(product);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally{
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    // Brands functionality removed for now
    setBrands([]);
  };

  const fetchBrandProduct = async (idBrand: number | undefined) => {
    const brand = brands.filter(b => b.id === idBrand);
    setBrand(brand[0]?.name);
  };

  useEffect(() => {
    if (params.id) {
      fetchProduct();
      fetchBrands();
      fetchProducts();
    }
  }, [params.id]);

  useEffect(() => {
  if (product && products.length > 0) {
    const categoryId = product.CategoryProduct?.[0].categoryId

    if (!categoryId) return

    const filtered = products.filter(
      (p) => p.CategoryProduct?.[0]?.categoryId === categoryId && p.id !== product.id
    )
    setRelatedProducts(filtered.slice(0, 4))
  }
}, [product, products])

  useEffect(() => {
  console.log("Producto actualizado:", product);
  //console.log("Marcas: ", brands);
  console.log("Relacionados: ", relatedProducts);
  
  fetchBrandProduct(product?.brandId)
}, [product, brands]);

  if (loading) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Cargando producto...</h1>
      </div>
      <Footer />
    </div>
  );
}

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <Link href="/productos" className="text-primary hover:underline">
            Volver a productos
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray hover:text-primary">
              Inicio
            </Link>
            <span className="text-gray">/</span>
            <Link href="/productos" className="text-gray hover:text-primary">
              Productos
            </Link>
            <span className="text-gray">/</span>
            <span className="text-primary">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div 
              className="relative overflow-hidden rounded-xl bg-white cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              {product.badge && (
                <span
                  className={`absolute top-4 left-4 px-3 py-1 text-sm font-medium rounded-full z-10 ${
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
              <Image
                src={product.images[selectedImage].url}
                alt={product.name}
                width={800}
                height={800}
                className={`w-full h-96 md:h-[500px] object-contain transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={{
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                }}
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-lg overflow-hidden ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-20 object-contain bg-white"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm text-gray">SKU: {product.sku}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary">{formatPrice(product.sellingPrice)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              {product.originalPrice && (
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 font-medium">
                    Ahorrás {formatPrice(product.originalPrice - product.price)}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
              )}
            </div>

            <p className="text-gray-700">{product.description}</p>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Cantidad:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="group relative overflow-hidden flex-1 bg-gradient-primary text-white px-6 py-4 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Agregar al carrito</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>

                <button className="px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <Truck className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-sm">Envío gratis</p>
                  <p className="text-xs text-gray">En compras +$50.000</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-sm">Devolución</p>
                  <p className="text-xs text-gray">30 días</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {/*
        <div className="mt-12 bg-white rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Especificaciones</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-medium">{key}:</span>
                <span className="text-gray">{value}</span>
              </div>
            ))}
          </div>
        </div>
        */}

        {/* Related Products */}
        { relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <Link href={`/producto/${relatedProduct.id}`}>
                    <Image
                      src={relatedProduct.images[0].url || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-contain rounded-lg mb-4"
                    />
                    <h3 className="font-semibold mb-2 hover:text-primary transition-colors">{relatedProduct.name}</h3>
                    <p className="text-primary font-bold">{formatPrice(relatedProduct.sellingPrice)}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
