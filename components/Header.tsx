"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useCategoryStore } from "@/store/categories";
import SearchModal from "@/components/SearchModal";
import { useHero } from "@/contexts/HeroContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const marqueeGroupRef = useRef<HTMLDivElement | null>(null);

  const { state } = useCart();
  const pathname = usePathname();
  const { currentGradient } = useHero();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getBannerColors = () => {
    if (currentGradient.includes("magenta")) {
      return {
        bg: "bg-gradient-to-r from-magenta/50 to-zafiro/50",
        text: "text-blanco",
      };
    } else if (currentGradient.includes("zafiro")) {
      return {
        bg: "bg-gradient-to-r from-zafiro/50 to-amatista/50",
        text: "text-blanco",
      };
    } else if (currentGradient.includes("amatista")) {
      return {
        bg: "bg-gradient-to-r from-amatista/50 to-oro/50",
        text: "text-negro",
      };
    } else if (currentGradient.includes("oro")) {
      return {
        bg: "bg-gradient-to-r from-oro/50 to-magenta/50",
        text: "text-negro",
      };
    }
    return {
      bg: "bg-gradient-to-r from-magenta/50 to-zafiro/50",
      text: "text-blanco",
    };
  };

  const bannerColors = getBannerColors();
  const isCartPage = pathname === "/carrito" || pathname === "/checkout";

  const messages = [
    "✈️ Envíos a todo el país",
    "🎁 3 y 6 cuotas sin interés",
    "🔥 Venta Mayorista",
  ];
  const marqueeItems = [...messages, ...messages, ...messages];

  useEffect(() => {
    if (isCartPage) return;

    const track = marqueeTrackRef.current;
    const group = marqueeGroupRef.current;
    if (!track || !group) return;

    let rafId = 0;
    let lastTs = 0;
    let offset = 0;
    let groupWidth = 0;
    const speed = 45;

    const setTransform = () => {
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };

    const measure = () => {
      groupWidth = group.offsetWidth;
      if (groupWidth > 0) {
        offset = ((offset % groupWidth) + groupWidth) % groupWidth;
        setTransform();
      }
    };

    const step = (ts: number) => {
      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      if (groupWidth > 0) {
        offset += speed * dt;
        if (offset >= groupWidth) {
          offset -= groupWidth;
        }
        setTransform();
      }

      rafId = window.requestAnimationFrame(step);
    };

    measure();
    rafId = window.requestAnimationFrame(step);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => measure());
      resizeObserver.observe(group);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [isCartPage]);

  return (
    <header className="bg-blanco shadow-sm sticky top-0 z-50 border-b border-gray-100">
      {!isCartPage && (
        <div className={`w-full overflow-hidden transition-all duration-500 ${bannerColors.bg}`}>
          <div className="topbar-marquee py-2">
            <div ref={marqueeTrackRef} className="topbar-marquee-track">
              <div ref={marqueeGroupRef} className="topbar-marquee-group">
                {marqueeItems.map((msg, index) => (
                  <span key={`group-a-${index}`} className={`text-sm font-medium ${bannerColors.text}`}>
                    {msg}
                  </span>
                ))}
              </div>
              <div className="topbar-marquee-group" aria-hidden="true">
                {marqueeItems.map((msg, index) => (
                  <span key={`group-b-${index}`} className={`text-sm font-medium ${bannerColors.text}`}>
                    {msg}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.png" alt="DIBUY" width={120} height={40} className="h-32 w-auto" />
          </Link>

          {!isCartPage && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar productos tecnológicos..."
                  className="input-primary w-full pr-12 py-2 bg-gray-200 text-white cursor-pointer"
                  onClick={() => setIsSearchModalOpen(true)}
                  readOnly
                />
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-magenta transition-colors"
                  onClick={() => setIsSearchModalOpen(true)}
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button className="md:hidden hover:text-magenta transition-colors" onClick={() => setIsSearchModalOpen(true)}>
              <Search className="h-5 w-5" />
            </button>

            <Link href="/carrito" className="relative nav-link">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 badge-magenta h-4 w-4 flex items-center justify-center text-xs">
                {state.itemCount}
              </span>
            </Link>

            <button className="md:hidden hover:text-magenta transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {!isCartPage && (
          <nav className="hidden md:block border-t border-gray-100">
            <div className="flex items-center py-3 gap-4">
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-6 overflow-x-auto categories-scroll">
                  {categories?.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categoria/${category.id}`}
                      className="text-sm font-medium text-gray-700 hover:text-magenta transition-colors whitespace-nowrap px-3 py-2 rounded-md hover:bg-gray-50 flex-shrink-0"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link
                href="/productos"
                className="text-sm font-medium text-magenta hover:text-magenta-dark transition-colors px-4 py-2 border border-magenta rounded-lg hover:bg-magenta hover:text-white flex-shrink-0"
              >
                Ver todo
              </Link>
            </div>
          </nav>
        )}

        {!isCartPage && (
          <nav className={`${isMenuOpen ? "block" : "hidden"} md:hidden border-t border-gray-100`}>
            <div className="py-2">
              <Link
                href="/productos"
                className="flex items-center space-x-2 px-4 py-2 bg-magenta text-white rounded-lg hover:bg-magenta-dark transition-colors w-full justify-center"
              >
                <span className="text-sm font-medium">Ver todos los productos</span>
              </Link>
            </div>
          </nav>
        )}
      </div>

      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </header>
  );
}
