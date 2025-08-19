"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Minus, Plus, Trash2, CreditCard, Truck, Shield, RotateCcw, CheckCircle } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/contexts/CartContext"

const paymentMethods = [
  { id: "credit", name: "Tarjeta de crédito", icon: CreditCard },
  { id: "debit", name: "Tarjeta de débito", icon: CreditCard },
  { id: "transfer", name: "Transferencia bancaria", icon: CreditCard },
]

const shippingMethods = [
  { id: "standard", name: "Envío estándar", price: 0, time: "3-5 días hábiles" },
  { id: "express", name: "Envío express", price: 5000, time: "1-2 días hábiles" },
  { id: "premium", name: "Envío premium", price: 10000, time: "Mismo día" },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { state, updateQuantity, removeItem, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "credit",
    shippingMethod: "standard",
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const selectedShipping = shippingMethods.find(m => m.id === formData.shippingMethod)
  const subtotal = state.total
  const shipping = selectedShipping?.price || 0
  const total = subtotal + shipping

  if (state.items.length === 0) {
    router.push("/carrito")
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else {
      // Simular procesamiento del pago
      alert("¡Pedido realizado con éxito!")
      clearCart()
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Finalizar compra</h1>
            <p className="text-lg opacity-90">Completa tu pedido de forma segura</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 1 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    {step > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
                  </div>
                  <span className={step >= 1 ? "font-medium" : "text-gray-500"}>Datos personales</span>
                </div>
                <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= 2 ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                    {step > 2 ? <CheckCircle className="h-5 w-5" /> : "2"}
                  </div>
                  <span className={step >= 2 ? "font-medium" : "text-gray-500"}>Pago</span>
                </div>
              </div>
            </div>

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Información personal</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nombre</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Apellido</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Teléfono</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Dirección</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ciudad</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Código postal</label>
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="group relative overflow-hidden w-full bg-gradient-primary text-white px-6 py-4 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    <span className="relative z-10">Continuar al pago</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Método de pago</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-4">Selecciona tu método de pago</label>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <label key={method.id} className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:border-primary cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={formData.paymentMethod === method.id}
                            onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                            className="text-primary"
                          />
                          <method.icon className="h-5 w-5 text-gray-400" />
                          <span>{method.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-4">Método de envío</label>
                    <div className="space-y-3">
                      {shippingMethods.map((method) => (
                        <label key={method.id} className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-primary cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="shippingMethod"
                              value={method.id}
                              checked={formData.shippingMethod === method.id}
                              onChange={(e) => setFormData({...formData, shippingMethod: e.target.value})}
                              className="text-primary"
                            />
                            <div>
                              <div className="font-medium">{method.name}</div>
                              <div className="text-sm text-gray-500">{method.time}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{method.price === 0 ? "Gratis" : formatPrice(method.price)}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      className="group relative overflow-hidden flex-1 bg-gradient-primary text-white px-6 py-4 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                      <span className="relative z-10">Confirmar pedido</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="w-15 h-15 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      <p className="text-sm font-medium">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Beneficios de tu compra</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Envío seguro</p>
                    <p className="text-xs text-gray-500">Seguimiento en tiempo real</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Garantía oficial</p>
                    <p className="text-xs text-gray-500">12 meses de garantía</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Devolución gratuita</p>
                    <p className="text-xs text-gray-500">Hasta 30 días</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 