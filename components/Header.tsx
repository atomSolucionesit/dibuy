"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X, User, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { useCategoryStore } from "@/store/categories";
import { Category } from "@/types/api";
import SearchModal from "@/components/SearchModal";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { categories: allCategories } = useCategoryStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const { state } = useCart();
  const pathname = usePathname();

  const isCartPage = pathname === "/carrito" || pathname === "/checkout";

  const messages = [
    "🚚 Envío gratis en compras superiores a $50.000",
    "💳 15% OFF pagando con transferencia",
    "🔥 Descuentos exclusivos en laptops",
    "🎁 3 y 6 cuotas sin interés",
  ];

  useEffect(() => {
    setCategories(allCategories.slice(0, 6));
  }, [allCategories]);

  const nextCategories = () => {
    if (categories.length > 6) {
      setCurrentCategoryIndex((prev) => 
        prev + 6 >= categories.length ? 0 : prev + 6
      );
    }
  };

  const prevCategories = () => {
    if (categories.length > 6) {
      setCurrentCategoryIndex((prev) => 
        prev - 6 < 0 ? Math.max(0, categories.length - 6) : prev - 6
      );
    }
  };

  const visibleCategories = categories.slice(currentCategoryIndex, currentCategoryIndex + 6);

  return (
    <header className="bg-blanco shadow-sm sticky top-0 z-50 border-b border-gray-100">
      {/* Top bar - Hidden on mobile */}
      {!isCartPage && (
        <div className="w-full overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              duration: 20, // velocidad
              ease: "linear",
            }}
          >
            {[...messages, ...messages].map((msg, index) => (
              <span key={index} className="mx-8 text-sm text-black">
                {msg}
              </span>
            ))}
          </motion.div>
        </div>
      )}
      <div className="container mx-auto px-4">
        {/* Main header */}
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="DIBUY"
              width={120}
              height={40}
              className="h-24 w-auto"
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



        {/* Navigation */}
        {!isCartPage && (
          <nav
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:block border-t border-gray-100 md:border-t-0`}
          >
            {/* Desktop Categories Carousel */}
            <div className="hidden md:flex items-center justify-center py-2 relative">
              {categories.length > 6 && (
                <button
                  onClick={prevCategories}
                  className="absolute left-0 p-1 hover:text-magenta transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              
              <ul className="flex space-x-6">
                {visibleCategories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/categoria/${category.slug || category.name.toLowerCase()}`}
                      className="nav-link text-sm whitespace-nowrap"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/ofertas"
                    className="nav-link text-sm text-zafiro font-semibold hover:text-zafiro-light whitespace-nowrap"
                  >
                    🔥 Ofertas
                  </Link>
                </li>
              </ul>
              
              {categories.length > 6 && (
                <button
                  onClick={nextCategories}
                  className="absolute right-0 p-1 hover:text-magenta transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Mobile Categories List */}
            <ul className="flex flex-col md:hidden space-y-1 py-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categoria/${category.slug || category.name.toLowerCase()}`}
                    className="nav-link block py-1 text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/ofertas"
                  className="nav-link block py-1 text-sm text-zafiro font-semibold hover:text-zafiro-light"
                >
                  🔥 Ofertas
                </Link>
              </li>
            </ul>
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
