"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useHero } from "@/contexts/HeroContext";

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
  const { setCurrentSlide: setContextSlide, setCurrentGradient } = useHero();
  const [currentSlide, setCurrentSlide] = useState(1); // Start at 1 (first real slide after clone)
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInfiniteJump, setIsInfiniteJump] = useState(false); // Flag for silent resets
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const slidesRefs = useRef<Array<HTMLDivElement | null>>([]);

  const banners = ["BANNER-1.jpeg", "BANNER-2.jpeg", "BANNER-3.jpeg"];

  useEffect(() => {
    const bannerSlides: HeroSlide[] = banners.map((banner, index) => ({
      id: `banner-${index}`,
      title: "Bienvenido a nuestra tienda",
      subtitle: "Ofertas imperdibles",
      description: "",
      badge: "✨ Promoción",
      image: `/${banner}`,
      primaryButton: { text: "Comprar ahora", href: "/productos" },
      secondaryButton: { text: "Ver catálogo", href: "/productos" },
      gradient: gradients[index % gradients.length],
      outstandingDescription: "Los mejores precios del mercado",
    }));

    setSlides(bannerSlides);
    setCurrentSlide(1); // Reset to 1 (first real slide after clone)
    setLoading(false);
  }, []);

  // Handle infinite carousel reset at edges
  useEffect(() => {
    if (slides.length === 0) return;
    
    if (currentSlide === 0) {
      // Jumped to clone of last slide, reset to real last slide
      setIsInfiniteJump(true);
      setTimeout(() => {
        setCurrentSlide(slides.length);
        setIsInfiniteJump(false);
      }, 500);
    } else if (currentSlide === slides.length + 1) {
      // Jumped to clone of first slide, reset to real first slide
      setIsInfiniteJump(true);
      setTimeout(() => {
        setCurrentSlide(1);
        setIsInfiniteJump(false);
      }, 500);
    }
  }, [currentSlide, slides.length]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || isInfiniteJump || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, isInfiniteJump, slides.length]);



  const goToSlide = (index: number) => {
    // index is 0-based for real slides, convert to cloned array index (add 1)
    if (isTransitioning || slides.length === 0)
      return;
    setIsTransitioning(true);
    setCurrentSlide(index + 1); // +1 because array has clone at start
    setContextSlide(index);
    if (slides[index]) setCurrentGradient(slides[index].gradient);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const nextSlide = () => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    const nextIndex = currentSlide + 1;
    setCurrentSlide(nextIndex);
    // For context, use real index (0-based)
    const realIndex = (nextIndex - 1) % slides.length;
    setContextSlide(realIndex);
    if (slides[realIndex]) setCurrentGradient(slides[realIndex].gradient);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning || slides.length === 0) return;
    setIsTransitioning(true);
    const prevIndex = currentSlide - 1;
    setCurrentSlide(prevIndex);
    // For context, use real index (0-based)
    const realIndex = prevIndex === 0 ? slides.length - 1 : prevIndex - 1;
    setContextSlide(realIndex);
    if (slides[realIndex]) setCurrentGradient(slides[realIndex].gradient);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading || slides.length === 0) {
    return (
      <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-magenta to-zafiro flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 border-b-2 border-white"></div>
      </section>
    );
  }

  // Create cloned carousel: [lastSlide, ...slides, firstSlide]
  const clonedSlides = slides.length > 0 ? [
    slides[slides.length - 1], // Clone of last slide at start
    ...slides,
    slides[0], // Clone of first slide at end
  ] : [];

  return (
    <section className="relative w-full">
      {/* Slides Container: infinite carousel */}
      <section className="relative w-full overflow-hidden bg-black">
        <div
          ref={sliderRef}
          className={`relative w-full aspect-[1920/500] flex ${!isInfiniteJump ? 'transition-transform duration-500 ease-in-out' : ''}`}
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {clonedSlides.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              ref={(el) => {
                slidesRefs.current[index] = el;
              }}
              className="w-full h-full flex-shrink-0 flex items-center justify-center"
            >
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>
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
              index + 1 === currentSlide // +1 because currentSlide is offset by clone
                ? "bg-blanco shadow-lg"
                : "bg-blanco/50 hover:bg-blanco/75"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-blanco/10 backdrop-blur-sm border border-blanco/20 rounded-full px-3 py-1 text-blanco text-xs font-medium">
          {((currentSlide - 1) % slides.length) + 1} / {slides.length}
        </div>
      </div>
    </section>
  );
}
