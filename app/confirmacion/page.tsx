"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, CreditCard, Home } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Suspense } from "react"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get("payment")

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="mb-6">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pago exitoso!</h1>
              <p className="text-gray-600">Tu pedido ha sido procesado correctamente</p>
            </div>

            {paymentId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">ID de transacción:</p>
                <p className="font-mono text-sm font-medium">{paymentId}</p>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 text-left">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Pago procesado</p>
                  <p className="text-sm text-gray-600">Tu pago fue procesado exitosamente</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-left">
                <div className="bg-orange-100 p-2 rounded-full">
                  <Package className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Preparando envío</p>
                  <p className="text-sm text-gray-600">Recibirás un email con el seguimiento</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/"
                className="w-full bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center space-x-2"
              >
                <Home className="h-5 w-5" />
                <span>Volver al inicio</span>
              </Link>
              <Link
                href="/productos"
                className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors inline-block"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}