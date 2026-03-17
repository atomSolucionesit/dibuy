"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useCategoryStore } from "@/store/categories";
import { useHero } from "@/contexts/HeroContext";
import { ProductService } from "@/services/productService";
import { Product } from "@/types/api";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasPromotions, setHasPromotions] = useState(false);
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const marqueeGroupRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const { state } = useCart();
  const pathname = usePathname();
  const { currentGradient } = useHero();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const promotions = await ProductService.getPromotions();
        setHasPromotions(Array.isArray(promotions) && promotions.length > 0);
      } catch (error) {
        console.error("Error loading promotions:", error);
        setHasPromotions(false);
      }
    };

    loadPromotions();
  }, []);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

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

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const clickedInsideSearch = Boolean(
        target?.closest('[data-search-scope="true"]'),
      );
      if (!clickedInsideSearch) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const debounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await ProductService.searchProducts(searchQuery.trim());
        const products = Array.isArray(data) ? data : [];
        setSearchResults(products.slice(0, 8));
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  return (
    <header className="bg-blanco shadow-sm sticky top-0 z-50 border-b border-gray-100">
      {!isCartPage && (
        <div
          className={`w-full overflow-hidden transition-all duration-500 ${bannerColors.bg}`}
        >
          <div className="topbar-marquee py-2">
            <div ref={marqueeTrackRef} className="topbar-marquee-track">
              <div ref={marqueeGroupRef} className="topbar-marquee-group">
                {marqueeItems.map((msg, index) => (
                  <span
                    key={`group-a-${index}`}
                    className={`text-sm font-medium ${bannerColors.text}`}
                  >
                    {msg}
                  </span>
                ))}
              </div>
              <div className="topbar-marquee-group" aria-hidden="true">
                {marqueeItems.map((msg, index) => (
                  <span
                    key={`group-b-${index}`}
                    className={`text-sm font-medium ${bannerColors.text}`}
                  >
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
            <Image
              src="/logo.png"
              alt="DIBUY"
              width={120}
              height={40}
              className="h-32 w-auto"
            />
          </Link>

          {!isCartPage && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full" data-search-scope="true">
                <input
                  type="text"
                  placeholder="Buscar productos tecnológicos..."
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  className="input-primary w-full pr-12 py-2 bg-gray-200 text-negro"
                />
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-magenta transition-colors"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-4 w-4" />
                </button>

                {isSearchOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-[420px] overflow-y-auto">
                    {searchQuery.trim().length < 2 ? (
                      <div className="p-4 text-sm text-gray-500">
                        Escribí al menos 2 caracteres para buscar productos
                      </div>
                    ) : isSearching ? (
                      <div className="p-4 text-sm text-gray-500">
                        Buscando...
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500">
                        No se encontraron productos
                      </div>
                    ) : (
                      <div className="py-2">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => {
                              setIsSearchOpen(false);
                              setSearchQuery("");
                              router.push(`/producto/${product.id}`);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                          >
                            <Image
                              src={
                                product.images?.[0]?.url || "/placeholder.svg"
                              }
                              alt={product.name}
                              width={48}
                              height={48}
                              className="rounded-lg object-contain bg-gray-100 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-sm text-negro truncate">
                                {product.name}
                              </p>
                              <p className="text-sm font-semibold text-magenta">
                                {formatPrice(product.sellingPrice)}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <button
              className="md:hidden hover:text-magenta transition-colors"
              onClick={() => setIsSearchOpen((prev) => !prev)}
            >
              <Search className="h-5 w-5" />
            </button>

            <Link href="/carrito" className="relative nav-link">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 badge-magenta h-4 w-4 flex items-center justify-center text-xs">
                {state.itemCount}
              </span>
            </Link>

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

        {!isCartPage && (
          <nav className="hidden md:block border-t border-gray-100">
            <div className="flex items-center py-3 gap-4">
              <div className="flex-1 overflow-hidden">
                <div className="categories-nav-container overflow-x-auto categories-scroll">
                  {hasPromotions && (
                    <Link href="/promociones" className="category-link-full text-magenta font-semibold">
                      PROMOS!!!
                    </Link>
                  )}
                  {categories?.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categoria/${category.id}`}
                      className="category-link-full"
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
          <nav className="md:hidden border-t border-gray-100 mb-4">
            <div className="overflow-x-auto categories-scroll">
              <div className="flex items-center gap-3 py-2 min-w-max">
                {hasPromotions && (
                  <Link
                    href="/promociones"
                    className="text-xs font-semibold text-magenta hover:text-magenta-dark transition-colors whitespace-nowrap px-3 py-2 rounded-md hover:bg-gray-50 flex-shrink-0"
                  >
                    PROMOS!!!
                  </Link>
                )}
                {categories?.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categoria/${category.id}`}
                    className="text-xs font-medium text-gray-700 hover:text-magenta transition-colors whitespace-nowrap px-3 py-2 rounded-md hover:bg-gray-50 flex-shrink-0"
                  >
                    {category.name}
                  </Link>
                ))}
                <Link
                  href="/productos"
                  className="text-xs font-medium text-magenta hover:text-magenta-dark transition-colors px-3 py-2 border border-magenta rounded-lg hover:bg-magenta hover:text-white flex-shrink-0"
                >
                  Ver todo
                </Link>
              </div>
            </div>
          </nav>
        )}

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
    </header>
  );
}
