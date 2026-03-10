"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Check,
  Truck,
  RotateCcw,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { ProductService } from "@/services/productService";
import { Product, Brand, ProductVariant, ProductVariantGroup } from "@/types/api";

export default function ProductPage() {
  const params = useParams();

  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [product, setProducto] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brand, setBrand] = useState<string | null>("hola");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product = await ProductService.getProductById(params.id as string);
      setProducto(product);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    // Brands functionality removed for now
    setBrands([]);
  };

  const fetchBrandProduct = async (idBrand: number | undefined) => {
    const brand = brands.filter((b) => b.id === idBrand);
    setBrand(brand[0]?.name);
  };

  useEffect(() => {
    if (params.id) {
      fetchProduct();
      fetchBrands();
    }
  }, [params.id]);

  useEffect(() => {
    const loadRelated = async () => {
      if (!product) return;
      const categoryId = product.CategoryProduct?.[0].categoryId;
      if (!categoryId) return;

      try {
        const response = await ProductService.getProductsByCategory(
          categoryId,
          1,
          8
        );
        const data = response?.data || [];
        const filtered = data.filter((p: Product) => p.id !== product.id);
        setRelatedProducts(filtered.slice(0, 4));
      } catch (error) {
        console.error("Error fetching related products:", error);
        setRelatedProducts([]);
      }
    };

    loadRelated();
  }, [product]);

  useEffect(() => {
    fetchBrandProduct(product?.brandId);
  }, [product, brands]);

  useEffect(() => {
    setSelectedOptions({});
  }, [product?.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const variantGroups: ProductVariantGroup[] = useMemo(
    () =>
      (product?.variantGroups || []).filter(
        (group) => (group?.options || []).length > 0,
      ),
    [product?.variantGroups],
  );

  const selectableVariants: ProductVariant[] = useMemo(() => {
    return ((product?.variants || []) as ProductVariant[]).filter(
      (variant) =>
        variant?.isActive !== false &&
        Number(variant?.stock || 0) > 0 &&
        (variant?.optionLinks || []).length > 0,
    );
  }, [product?.variants]);

  const hasVariantGroups = Boolean(
    product?.hasVariants && variantGroups.length > 0 && selectableVariants.length > 0,
  );

  const isOptionEnabled = (
    groupId: string,
    optionId: string,
  ): boolean => {
    if (!hasVariantGroups) return true;
    return selectableVariants.some((variant) => {
      const links = variant.optionLinks || [];
      const hasOption = links.some(
        (link) => link.groupId === groupId && link.optionId === optionId,
      );
      if (!hasOption) return false;

      return Object.entries(selectedOptions).every(([selectedGroupId, selectedOptionId]) => {
        if (selectedGroupId === groupId) return true;
        return links.some(
          (link) =>
            link.groupId === selectedGroupId &&
            link.optionId === selectedOptionId,
        );
      });
    });
  };

  const toggleGroupOption = (groupId: string, optionId: string) => {
    setSelectedOptions((prev) => {
      if (prev[groupId] === optionId) {
        const copy = { ...prev };
        delete copy[groupId];
        return copy;
      }
      return { ...prev, [groupId]: optionId };
    });
  };

  const selectedVariant = useMemo(() => {
    if (!hasVariantGroups) return null;
    if (Object.keys(selectedOptions).length !== variantGroups.length) return null;

    return (
      selectableVariants.find((variant) => {
        const links = variant.optionLinks || [];
        return variantGroups.every((group) =>
          links.some(
            (link) =>
              link.groupId === group.id &&
              link.optionId === selectedOptions[group.id],
          ),
        );
      }) || null
    );
  }, [hasVariantGroups, selectableVariants, selectedOptions, variantGroups]);

  const canAddToCart = !hasVariantGroups || Boolean(selectedVariant);

  const handleAddToCart = () => {
    if (!product) return;
    if (hasVariantGroups && !selectedVariant) return;

    const selectedVariantLabels =
      selectedVariant?.optionLinks
        ?.map((link) => link.option?.displayLabel || link.option?.value)
        ?.filter(Boolean) || [];

    const productWithSelection = {
      ...product,
      selectedColor:
        selectedVariantLabels.length > 0
          ? selectedVariantLabels.join(" / ")
          : product.color
            ? product.color.split(",")[0]
            : "",
      selectedVariantCombinationId: selectedVariant?.id || null,
      selectedVariantName: selectedVariant?.name || null,
      selectedVariantOptions: selectedOptions,
    };
    for (let i = 0; i < quantity; i++) {
      addItem(productWithSelection as Product);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

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
    );
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
                src={product?.images[selectedImage]?.url}
                alt={product.name}
                width={800}
                height={800}
                className={`w-full h-96 md:h-[500px] object-contain transition-transform duration-300 ${
                  isZoomed ? "scale-150" : "scale-100"
                }`}
                style={{
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
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
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm text-gray">SKU: {product?.sku}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.sellingPrice)}
                </span>
                {/* {product.originalPrice && (
                  <span className="text-lg text-gray line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )} */}
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray">
                {product.haveIvaInPrice ? "Precio c/IVA incluído" : "Precio s/IVA incluído"}
              </div>

            </div>

            <p className="text-gray-700">{product.description}</p>

            {/* Variantes */}
            {hasVariantGroups && (
              <div className="space-y-3">
                <span className="font-medium">Variantes:</span>
                {variantGroups.map((group) => (
                  <div key={group.id} className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700">{group.name}</div>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((option) => {
                        const selected = selectedOptions[group.id] === option.id;
                        const enabled = isOptionEnabled(group.id, option.id);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              enabled && toggleGroupOption(group.id, option.id)
                            }
                            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                              selected
                                ? "border-primary text-primary bg-primary/10"
                                : enabled
                                  ? "border-gray-300 text-gray-700 bg-white hover:border-primary/50"
                                  : "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                            }`}
                            disabled={!enabled}
                          >
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-[4px] border ${
                                selected
                                  ? "bg-primary border-primary text-white"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {selected ? <Check className="h-3 w-3" /> : null}
                            </span>
                            {option.colorHex ? (
                              <span
                                className="h-3.5 w-3.5 rounded-full border border-gray-300"
                                style={{ backgroundColor: option.colorHex }}
                              />
                            ) : null}
                            <span>{option.name}</span>
                            <span>{option.displayLabel || option.value}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {!selectedVariant && (
                  <p className="text-xs text-gray-500">
                    Selecciona una opción en cada grupo para poder agregar al carrito.
                  </p>
                )}
                {selectedVariant && (
                  <p className="text-xs text-green-700">
                    Combinación: {selectedVariant.name}
                  </p>
                )}
              </div>
            )}

            {!hasVariantGroups && product.color && (
              <div className="space-y-3">
                <span className="font-medium">Color:</span>
                <div className="flex flex-wrap gap-2">
                  {product.color.split(",").map((color, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 border rounded-lg text-sm font-medium border-gray-300 text-gray-700"
                    >
                      {color.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Cantidad:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className={`group relative overflow-hidden flex-1 px-6 py-4 rounded-lg font-medium transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 ${
                    canAddToCart
                      ? "bg-gradient-primary text-white hover:opacity-90 hover:shadow-xl hover:scale-105 active:scale-95"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
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
        {relatedProducts.length > 0 && (
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
                    <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-primary font-bold">
                      {formatPrice(relatedProduct.sellingPrice)}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
