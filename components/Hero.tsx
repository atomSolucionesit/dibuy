"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { ProductService } from "@/services/productService";
import { Product } from "@/types/api";
import { useCart } from "@/contexts/CartContext";
import { getProcessedImage } from "@/lib/imageUtils";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  image: string;
  primaryButton: { text: string; href: string };
  secondaryButton: { text: string; href: string };
  gradient: string;
  price?: number;
  originalPrice?: number;
  outstandingDescription?: string;
}

const gradients = [
  "from-magenta to-zafiro",
  "from-zafiro to-amatista",
  "from-amatista to-oro",
  "from-oro to-magenta",
];

export default function Hero() {
  const { addItem } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [processedImages, setProcessedImages] = useState<{[key: string]: string}>({});

  // Cargar productos destacados
  useEffect(() => {
    const loadOutstandingProducts = async () => {
      try {
        const products = await ProductService.getOutstandingProducts(4);
        const heroSlides: HeroSlide[] = await Promise.all(
          (products || []).map(async (product: any, index: any) => {
            const originalImage = product.images[0]?.url || "/placeholder.svg?height=400&width=500";
            let processedImage = originalImage;
            
            // Procesar imagen para remover fondo
            try {
              processedImage = await getProcessedImage(originalImage);
              setProcessedImages(prev => ({...prev, [product.id]: processedImage}));
            } catch (error) {
              console.log('Using original image for:', product.name);
            }
            
            return {
              id: product.id,
              title: product.name,
              subtitle: product.outstandingDescription || "Producto destacado",
              description: product.description,
              badge: product.badge || "⭐ Destacado",
              image: processedImage,
              primaryButton: {
                text: "Ver producto",
                href: `/producto/${product.id}`,
              },
              secondaryButton: {
                text: "Agregar al carrito",
                href: `/producto/${product.id}`,
              },
              gradient: gradients[index % gradients.length],
              price: product.sellingPrice,
              originalPrice: product.originalPrice,
              outstandingDescription: "Al mejor precio",
            };
          })
        );
        setSlides(heroSlides);
        setProducts(products || []);
      } catch (error) {
        console.error("Error loading outstanding products:", error);
        // Fallback a slides estáticos si falla la carga
        setSlides([
          {
            id: "1",
            title: "La tecnología que necesitas",
            subtitle: "al mejor precio",
            description:
              "Descubre nuestra amplia selección de productos tecnológicos.",
            badge: "🚀 Tecnología",
            image: "/placeholder.svg?height=400&width=500",
            primaryButton: { text: "Ver productos", href: "/productos" },
            secondaryButton: { text: "Ofertas", href: "/productos" },
            gradient: "from-magenta to-zafiro",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadOutstandingProducts();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide || slides.length === 0)
      return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const nextSlide = () => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading || slides.length === 0) {
    return (
      <section className="relative w-full h-[calc(100vh-120px)] overflow-hidden bg-gradient-to-br from-magenta to-zafiro flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[calc(100vh-120px)] overflow-hidden">
      {/* Slides Container */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * (100 / slides.length)}%)`,
          width: `${slides.length * 100}%`,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="relative w-full h-full flex-shrink-0"
            style={{ width: `${100 / slides.length}%` }}
          >
            {/* Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
            ></div>
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blanco/10 via-transparent to-blanco/5"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-oro/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amatista/10 rounded-full blur-3xl"></div>

            {/* Content */}
            <div className="container mx-auto px-16 h-full relative z-10 flex items-center">
              <div className="grid md:grid-cols-2 gap-6 items-center w-full">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="badge-oro text-negro text-xs font-semibold px-3 py-1 rounded-full">
                      {slide.badge}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-bold leading-tight text-blanco">
                    {slide.title}
                    <span className="block bg-gradient-to-r from-oro to-magenta bg-clip-text text-transparent">
                      {slide.subtitle}
                    </span>
                  </h1>
                  <p className="text-base md:text-lg opacity-90 text-blanco">
                    {slide.outstandingDescription}
                  </p>
                  {slide.price && (
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-oro">
                        ${slide.price.toLocaleString()}
                      </span>
                      {slide.originalPrice &&
                        slide.originalPrice > slide.price && (
                          <span className="text-lg text-blanco/60 line-through">
                            ${slide.originalPrice.toLocaleString()}
                          </span>
                        )}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={slide.primaryButton.href}
                      className="group relative overflow-hidden bg-blanco/10 backdrop-blur-sm border border-blanco/20 text-blanco px-6 py-3 rounded-xl font-semibold hover:bg-blanco/20 transition-all duration-300 shadow-2xl hover:shadow-blanco/25 hover:scale-105 active:scale-95 text-sm"
                    >
                      <span className="relative z-10">
                        {slide.primaryButton.text}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blanco/0 via-blanco/10 to-blanco/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </Link>
                    <button
                      onClick={() => {
                        const product = products.find(p => p.id === slide.id);
                        if (product) addItem(product);
                      }}
                      className="group relative overflow-hidden bg-gradient-to-r from-oro to-magenta text-negro px-6 py-3 rounded-xl font-semibold hover:from-magenta hover:to-oro hover:text-blanco transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 text-sm"
                    >
                      <span className="relative z-10">
                        {slide.secondaryButton.text}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-negro/0 via-negro/5 to-negro/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="flex items-center space-x-1 text-xs">
                      <span className="w-1.5 h-1.5 bg-oro rounded-full"></span>
                      <span>Envío gratis</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      <span className="w-1.5 h-1.5 bg-magenta rounded-full"></span>
                      <span>Garantía oficial</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      <span className="w-1.5 h-1.5 bg-zafiro rounded-full"></span>
                      <span>Pagos seguros</span>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative">
                    <Image
                      src={processedImages[slide.id] || slide.image}
                      alt={slide.title}
                      width={400}
                      height={300}
                      className="rounded-lg object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex justify-between px-4">
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="p-2 bg-blanco/10 backdrop-blur-sm border border-blanco/20 rounded-full text-blanco hover:bg-blanco/20 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="p-2 bg-blanco/10 backdrop-blur-sm border border-blanco/20 rounded-full text-blanco hover:bg-blanco/20 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Play/Pause Control */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={togglePlayPause}
          className="p-2 bg-blanco/10 backdrop-blur-sm border border-blanco/20 rounded-full text-blanco hover:bg-blanco/20 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-blanco shadow-lg"
                : "bg-blanco/50 hover:bg-blanco/75"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-blanco/10 backdrop-blur-sm border border-blanco/20 rounded-full px-3 py-1 text-blanco text-xs font-medium">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </section>
  );
}
