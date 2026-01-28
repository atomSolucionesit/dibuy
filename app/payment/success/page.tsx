"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Limpiar carrito al confirmar pago exitoso
    clearCart();
    
    // Obtener datos del pago desde los parámetros de URL
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    
    if (paymentId) {
      setPaymentData({
        id: paymentId,
        status: status || 'approved',
        timestamp: new Date().toISOString()
      });
    }
  }, [searchParams]); // Removed clearCart from dependencies

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Pago exitoso!
              </h1>
              <p className="text-gray-600">
                Tu compra ha sido procesada correctamente
              </p>
            </div>

            {paymentData && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  ID de transacción: <span className="font-mono">{paymentData.id}</span>
                </p>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center space-x-3 text-gray-700">
                <Package className="h-5 w-5" />
                <span>Preparando tu pedido</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-700">
                <Truck className="h-5 w-5" />
                <span>Recibirás el tracking por email</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              >
                <span>Seguir comprando</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}