"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart, Menu, X, User, Heart } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { motion } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { state } = useCart()
  const pathname = usePathname()

  const isCartPage = pathname === "/carrito" || pathname === "/checkout"

  const messages = [
    "🚚 Envío gratis en compras superiores a $50.000",
    "💳 15% OFF pagando con transferencia",
    "🔥 Descuentos exclusivos en laptops",
    "🎁 3 y 6 cuotas sin interés"
  ]

  return (
    <header className="bg-blanco shadow-sm sticky top-0 z-50 border-b border-gray-100">
      {/* Top bar - Hidden on mobile */}
        {!isCartPage && (
          <div className="w-full bg-black text-white overflow-hidden border-b border-gray-700">
            <motion.div
              className="flex whitespace-nowrap"
              animate={{ x: ["0%", "-100%"] }}
              transition={{ 
                repeat: Infinity, 
                duration: 20, // velocidad
                ease: "linear" 
              }}
            >
              {[...messages, ...messages].map((msg, index) => (
                <span
                  key={index}
                  className="mx-8 text-sm md:text-base text-yellow-300"
                >
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
            <Image src="/logo.png" alt="DIBUY" width={120} height={40} className="h-24 w-auto" />
          </Link>

          {/* Search bar - Desktop */}
          { !isCartPage && (
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar productos tecnológicos..."
                className="input-primary w-full pr-12 py-2"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-magenta transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
          )}

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Search icon - Mobile */}
            <button className="md:hidden hover:text-magenta transition-colors" onClick={() => setIsSearchOpen(!isSearchOpen)}>
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
            <button className="md:hidden hover:text-magenta transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {isSearchOpen && (
          <div className="md:hidden pb-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="input-primary w-full pr-12 py-2"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-magenta transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        { !isCartPage && (
        <nav className={`${isMenuOpen ? "block" : "hidden"} md:block border-t border-gray-100 md:border-t-0`}>
          <ul className="flex flex-col md:flex-row md:justify-center space-y-1 md:space-y-0 md:space-x-6 py-2">
            <li>
              <Link href="/categoria/smartphones" className="nav-link block py-1 md:py-0 text-sm">
                📱 Smartphones
              </Link>
            </li>
            <li>
              <Link href="/categoria/laptops" className="nav-link block py-1 md:py-0 text-sm">
                💻 Laptops
              </Link>
            </li>
            <li>
              <Link href="/categoria/tablets" className="nav-link block py-1 md:py-0 text-sm">
                📱 Tablets
              </Link>
            </li>
            <li>
              <Link href="/categoria/accesorios" className="nav-link block py-1 md:py-0 text-sm">
                🎧 Accesorios
              </Link>
            </li>
            <li>
              <Link href="/categoria/gaming" className="nav-link block py-1 md:py-0 text-sm">
                🎮 Gaming
              </Link>
            </li>
            <li>
              <Link href="/ofertas" className="nav-link block py-1 md:py-0 text-sm text-zafiro font-semibold hover:text-zafiro-light">
                🔥 Ofertas
              </Link>
            </li>
          </ul>
        </nav>
        )}
      </div>
    </header>
  )
}
