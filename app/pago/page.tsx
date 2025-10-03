"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Lock, ArrowLeft } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/contexts/CartContext"
import { createNexusPayment, getNexusPaymentStatus, processNexusPayment } from "@/services/nexusPayments"
import { mapDibuyToNexusSale } from "@/lib/nexusConfig"

export default function PaymentPage() {
  const router = useRouter()
  const { clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [checkoutData, setCheckoutData] = useState<any>(null)


  useEffect(() => {
    const data = localStorage.getItem('checkoutData')
    if (data) {
      setCheckoutData(JSON.parse(data))
    } else {
      router.push('/checkout')
    }
  }, [])

  if (!checkoutData) return null

  const { total, subtotal, items } = checkoutData

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const transactionId = `dibuy-${Date.now()}`
      const payment = await createNexusPayment(total, transactionId)
      
      // Redirigir al checkout de Payway
      window.location.href = payment.payment_url
    } catch (error) {
      console.error("Error en el pago:", error)
      alert("Hubo un error al procesar el pago. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <section className="bg-gradient-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Pago seguro</h1>
            <p className="text-lg opacity-90">Completa tu pago con Payway</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver</span>
          </button>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Pago seguro</h2>
                <p className="text-gray-600">Procesar pago con Payway Sandbox</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">Pago 100% seguro con Payway</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">Pago con Payway</h3>
                <p className="text-blue-600 text-sm">Formulario seguro de pago con tokenización.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total a pagar:</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Número de tarjeta *</label>
                  <input
                    type="text"
                    placeholder="1234567890123456"
                    maxLength={16}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vencimiento *</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CVV *</label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={4}
                      className="w-full p-3 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre del titular *</label>
                  <input
                    type="text"
                    placeholder="Juan Perez"
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">DNI del titular *</label>
                  <input
                    type="text"
                    placeholder="12345678"
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={async () => {
                  setLoading(true)
                  try {
                    await new Promise(resolve => setTimeout(resolve, 2000))
                    localStorage.removeItem('checkoutData')
                    clearCart()
                    router.push('/confirmacion?payment=pay_success&status=success')
                  } catch (error) {
                    alert('Error procesando pago')
                  } finally {
                    setLoading(false)
                  }
                }}
                className="w-full bg-gradient-primary text-white px-6 py-4 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Procesando pago..." : `Pagar ${formatPrice(total)}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}