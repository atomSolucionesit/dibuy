"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/contexts/CartContext"
import { getShippingCost } from "@/services/shipping"
import { provincias } from "@/data/provincias"

export default function CartPage() {
  const { state, updateQuantity, removeItem, clearCart, setShipping, clearShipping } = useCart()
  //const [shipping, setShipping] = useState<number | null>(null)
  const [loadingShipping, setLoadingShipping] = useState(false)
  const [provincia, setProvincia] = useState("AR-C")
  const [codigoPostal, setCodigoPostal] = useState("")
  const [empresa, setEmpresa] = useState("correoArgentino")
  const [quotes, setQuotes] = useState<{ name: string; price: number }[]>([])
  const [selectedQuote, setSelectedQuote] = useState<{ name: string; price: number } | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calcularEnvio = () => {
    if (!codigoPostal) return
    setLoadingShipping(true)

    getShippingCost("1001", codigoPostal, "5", empresa)
      .then((data) => {
        const servicios = data || []
        const opciones: { name: string; price: number }[] = []
        const filtrados = servicios.filter((s: any) => s.fiscalType === "py")

        filtrados.forEach((s: any) => {
          if (s.quotes && s.quotes.length > 0) {
            s.quotes.forEach((q: any) => {
              if (q.office) {
                opciones.push({ name: `${q.name} a sucursal`, price: q.office })
              }
              if (q.door) {
                opciones.push({ name: `${q.name} a domicilio`, price: q.door })
              }
            })
          }
        })

        setQuotes(opciones)
        if (opciones.length > 0) setSelectedQuote(opciones[0])
      })
      .finally(() => setLoadingShipping(false))
  }

  useEffect(() => {
    if (state.items.length === 0) clearShipping()
  }, [state.items])

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header/>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-6" />
            <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
            <p className="text-gray mb-8">¡Descubre nuestros increíbles productos!</p>
            <Link
              href="/productos"
              className="group relative overflow-hidden bg-gradient-primary text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Explorar productos</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Carrito de compras</h1>
            <p className="text-lg opacity-90">{state.itemCount} productos en tu carrito</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Productos ({state.itemCount})</h2>
                <button onClick={clearCart} className="text-red-500 hover:text-red-700 text-sm font-medium">
                  Vaciar carrito
                </button>
              </div>

              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                    <Image
                      src={item.images?.[0]?.url || "/placeholder.svg"}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                    />

                    <div className="flex-1 space-y-2">
                      <Link href={`/producto/${item.id}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors">{item.name}</h3>
                      </Link>
                      <p className="text-sm text-gray">Marca: {item.brandId}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-primary">{formatPrice(item.sellingPrice)}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray line-through">{formatPrice(item.originalPrice)}</span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 py-1 min-w-[40px] text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
              <hr></hr>
              <div className="space-y-3">
                <div className="flex justify-between">
                  {/* Zona de envío */}
                  <div className="bg-white rounded-xl py-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4">Calcular envío</h2>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Provincia</label>
                        <select
                          value={provincia}
                          onChange={(e) => setProvincia(e.target.value)}
                          className="w-full px-3 py-2 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
                        >
                          {provincias.map((p) => (
                            <option key={p.code} value={p.code}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm mb-1">Código postal</label>
                        <input
                          type="text"
                          value={codigoPostal}
                          onChange={(e) => setCodigoPostal(e.target.value)}
                          className="w-full px-3 py-2 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
                          placeholder="Ej: 4600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-1">Empresa</label>
                        <select
                          value={empresa}
                          onChange={(e) => setEmpresa(e.target.value)}
                          className="w-full px-3 py-2 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
                        >
                          <option value="oca">OCA</option>
                          <option value="correoArgentino">Correo Argentino</option>
                          <option value="andreani">Andreani</option>
                        </select>
                      </div>

                      <button
                        onClick={calcularEnvio}
                        className="w-full bg-gradient-primary text-white px-4 py-2 rounded-lg mt-2 hover:opacity-90 transition"
                      >
                        Calcular envío
                      </button>
                      {quotes.length > 0 && (
                        <div className="mt-4">
                          <label className="block text-sm mb-1">Método de envío</label>
                          <select
                            value={selectedQuote?.name || ""}
                            onChange={(e) => {
                              const q = quotes.find((quote) => quote.name === e.target.value)
                              if (q) {
                                setSelectedQuote(q)
                                setShipping(q)
                              }
                            }}
                            className="w-full px-3 py-2 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
                          >
                            {quotes.map((q) => (
                              <option key={q.name} value={q.name}>
                                {q.name.toUpperCase()} - {formatPrice(q.price)}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(state.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>{selectedQuote ? formatPrice(selectedQuote.price) : "-"}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">
                      {formatPrice(state.total + (selectedQuote?.price || 0))}
                    </span>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <button className="group relative overflow-hidden w-full bg-gradient-primary text-white px-6 py-4 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 mt-6">
                  <span className="relative z-10">Proceder al pago</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </Link>

              <Link href="/productos" className="block text-center text-primary hover:underline mt-4">
                Continuar comprando
              </Link>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Beneficios de comprar con nosotros</h3>
              <ul className="space-y-2 text-sm text-gray">
                <li>✓ Envío gratis en compras superiores a $50.000</li>
                <li>✓ Garantía oficial de 12 meses</li>
                <li>✓ Devolución gratuita hasta 30 días</li>
                <li>✓ Soporte técnico especializado</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
