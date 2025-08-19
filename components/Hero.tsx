"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"

const slides = [
  {
    id: 1,
    title: "La tecnología que necesitas",
    subtitle: "al mejor precio",
    description: "Descubre nuestra amplia selección de productos tecnológicos con la mejor calidad y garantía del mercado.",
    badge: "🚀 Tecnología de vanguardia",
    image: "/placeholder.svg?height=400&width=500",
    primaryButton: { text: "🛍️ Ver productos", href: "/productos" },
    secondaryButton: { text: "🔥 Ofertas especiales", href: "/ofertas" },
    gradient: "from-magenta to-zafiro",
    floatingElements: [
      { icon: "📱", position: "top-right", color: "magenta" },
      { icon: "💻", position: "bottom-left", color: "zafiro" }
    ]
  },
  {
    id: 2,
    title: "Smartphones de última generación",
    subtitle: "con descuentos increíbles",
    description: "Los mejores smartphones con las últimas tecnologías. iPhone, Samsung, Xiaomi y más marcas premium.",
    badge: "📱 Smartphones Premium",
    image: "/placeholder.svg?height=400&width=500",
    primaryButton: { text: "📱 Ver smartphones", href: "/categoria/smartphones" },
    secondaryButton: { text: "💳 Financiación", href: "/financiacion" },
    gradient: "from-zafiro to-amatista",
    floatingElements: [
      { icon: "📱", position: "top-left", color: "zafiro" },
      { icon: "⚡", position: "bottom-right", color: "oro" }
    ]
  },
  {
    id: 3,
    title: "Laptops para trabajo y gaming",
    subtitle: "potencia sin límites",
    description: "Laptops gaming, ultrabooks y estaciones de trabajo. Encuentra la computadora perfecta para tus necesidades.",
    badge: "💻 Laptops Gaming",
    image: "/placeholder.svg?height=400&width=500",
    primaryButton: { text: "💻 Ver laptops", href: "/categoria/laptops" },
    secondaryButton: { text: "🎮 Gaming", href: "/categoria/gaming" },
    gradient: "from-amatista to-oro",
    floatingElements: [
      { icon: "💻", position: "top-right", color: "amatista" },
      { icon: "🎮", position: "bottom-left", color: "oro" }
    ]
  },
  {
    id: 4,
    title: "Accesorios y periféricos",
    subtitle: "completa tu setup",
    description: "Auriculares, teclados, mouses y más accesorios para completar tu experiencia tecnológica.",
    badge: "🎧 Accesorios Premium",
    image: "/placeholder.svg?height=400&width=500",
    primaryButton: { text: "🎧 Ver accesorios", href: "/categoria/accesorios" },
    secondaryButton: { text: "🎵 Audio", href: "/categoria/audio" },
    gradient: "from-oro to-magenta",
    floatingElements: [
      { icon: "🎧", position: "top-left", color: "oro" },
      { icon: "⌨️", position: "bottom-right", color: "magenta" }
    ]
  }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return
    setIsTransitioning(true)
    setCurrentSlide(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="relative w-full h-[calc(100vh-120px)] overflow-hidden">
      {/* Slides Container */}
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * (100 / slides.length)}%)`,
          width: `${slides.length * 100}%`
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="relative w-full h-full flex-shrink-0"
            style={{ width: `${100 / slides.length}%` }}
          >
            {/* Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}></div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blanco/10 via-transparent to-blanco/5"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-oro/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-amatista/10 rounded-full blur-3xl"></div>
            
            {/* Content */}
            <div className="container mx-auto px-4 h-full relative z-10 flex items-center">
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
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={slide.primaryButton.href}
                      className="group relative overflow-hidden bg-blanco/10 backdrop-blur-sm border border-blanco/20 text-blanco px-6 py-3 rounded-xl font-semibold hover:bg-blanco/20 transition-all duration-300 shadow-2xl hover:shadow-blanco/25 hover:scale-105 active:scale-95 text-sm"
                    >
                      <span className="relative z-10">{slide.primaryButton.text}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blanco/0 via-blanco/10 to-blanco/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </Link>
                    <Link
                      href={slide.secondaryButton.href}
                      className="group relative overflow-hidden bg-gradient-to-r from-oro to-magenta text-negro px-6 py-3 rounded-xl font-semibold hover:from-magenta hover:to-oro hover:text-blanco transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 text-sm"
                    >
                      <span className="relative z-10">{slide.secondaryButton.text}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-negro/0 via-negro/5 to-negro/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </Link>
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
                      src={slide.image}
                      alt={slide.title}
                      width={400}
                      height={300}
                      className="rounded-lg shadow-2xl border border-blanco/20"
                    />
                    {/* Floating elements */}
                    {slide.floatingElements.map((element, idx) => (
                      <div
                        key={idx}
                        className={`absolute p-2 rounded-full shadow-lg ${
                          element.position === "top-right" ? "-top-2 -right-2" :
                          element.position === "bottom-left" ? "-bottom-2 -left-2" :
                          element.position === "top-left" ? "-top-2 -left-2" :
                          "-bottom-2 -right-2"
                        } bg-${element.color} text-blanco`}
                      >
                        <span className="text-lg">{element.icon}</span>
                      </div>
                    ))}
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
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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
  )
}
