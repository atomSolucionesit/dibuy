"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  Heart,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { useCategoryStore } from "@/store/categories";
import { Category } from "@/types/api";
import SearchModal from "@/components/SearchModal";
import { useHero } from "@/contexts/HeroContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { state } = useCart();
  const pathname = usePathname();
  const { currentGradient } = useHero();
  const { categories, fetchCategories } = useCategoryStore();

  // Cargar categorías al montar el componente
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

  return (
    <header className="bg-blanco shadow-sm sticky top-0 z-50 border-b border-gray-100">
      {/* Top bar - Hidden on mobile */}
      {!isCartPage && (
        <div
          className={`w-full overflow-hidden transition-all duration-500 ${bannerColors.bg}`}
        >
          <motion.div
            className="flex whitespace-nowrap py-2"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
          >
            {[...messages, ...messages].map((msg, index) => (
              <span
                key={index}
                className={`mx-8 text-sm font-medium ${bannerColors.text}`}
              >
                {msg}
              </span>
            ))}
          </motion.div>
        </div>
      )}
      <div className="container mx-auto px-4">
        {/* Main header */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="DIBUY"
              width={120}
              height={40}
              className="h-32 w-auto"
            />
          </Link>

          {/* Search bar - Desktop */}
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

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Search icon - Mobile */}
            <button
              className="md:hidden hover:text-magenta transition-colors"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Search className="h-5 w-5" />
            </button>

            {/* User account */}
            {/* <Link href="/perfil" className="hidden md:flex items-center space-x-1 nav-link">
              <User className="h-4 w-4" />
              <span className="text-xs">Mi cuenta</span>
            </Link> */}

            {/* Wishlist */}
            {/* <Link href="/favoritos" className="relative nav-link">
              <Heart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 badge-zafiro h-4 w-4 flex items-center justify-center text-xs">
                2
              </span>
            </Link> */}

            {/* Cart */}
            <Link href="/carrito" className="relative nav-link">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 badge-magenta h-4 w-4 flex items-center justify-center text-xs">
                {state.itemCount}
              </span>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden hover:text-magenta transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation - Desktop Categories Carousel */}
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

        {/* Mobile Navigation */}
        {!isCartPage && (
          <nav
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:hidden border-t border-gray-100`}
          >
            <div className="py-2">
              <Link
                href="/productos"
                className="flex items-center space-x-2 px-4 py-2 bg-magenta text-white rounded-lg hover:bg-magenta-dark transition-colors w-full justify-center"
              >
                <span className="text-sm font-medium">
                  Ver todos los productos
                </span>
              </Link>
            </div>
          </nav>
        )}
      </div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </header>
  );
}
