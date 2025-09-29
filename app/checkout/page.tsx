"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Minus, Plus, Trash2, CreditCard, Truck, Shield, RotateCcw, CheckCircle } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/contexts/CartContext"
import { createSale } from "@/api/sales/saleService"
import { createToken, createPayment, getPaymentStatus } from "@/services/payments"

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
  const [saleId, setSaleId] = useState<string | null>(null);
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

  // Datos de tarjeta
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");

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

// Paso 1: crear venta
const handleCreateSale = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    const sale = await createSale({
      total,
      subTotal: subtotal,
      taxAmount: 0,
      status: "PENDING",
      receiptTypeId: 1,
      documentTypeId: 1,
      currencyId: 1,
      paymentCharge: {
        amountPaid: 0,
        turned: 0,
        isCredit: false,
        date: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        outstandingBalance: 0,
        details: [],
      },
      details: state.items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.sellingPrice,
        discount: 0,
      })),
    });

    setSaleId(sale.info.id);
    setStep(2);
  } catch (err) {
    console.error(err);
    alert("Error al crear la venta");
  }
};

// Paso 2: procesar pago
const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Tokenizar tarjeta
      const tokenData = await createToken({
        card_number: cardNumber,
        card_expiration_month: expMonth,
        card_expiration_year: expYear,
        security_code: cvv,
      });

      const token = tokenData.info.id;

      // 2. Crear pago
      const payment = await createPayment(token, total, saleId);

      // 3. Consultar estado
      const paymentInfo = await getPaymentStatus(payment.id);

      if (paymentInfo.status === "PAID") {
        clearCart();
        router.push("/confirmacion");
      } else {
        alert("El pago no se pudo procesar");
      }
    } catch (err) {
      console.error(err);
      alert("Error al procesar el pago");
    }
  };

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
                <form onSubmit={handleCreateSale} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nombre</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-4 py-3 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Apellido</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-4 py-3 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
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
                        className="w-full px-4 py-3 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Teléfono</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
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
                      className="w-full px-4 py-3 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
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
                        className="w-full px-4 py-3 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Código postal</label>
                      <input
                        type="text"
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        className="w-full px-4 py-3 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
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
              <form onSubmit={handleProcessPayment} className="space-y-6">
                <h2 className="text-lg font-semibold">Datos de tarjeta</h2>

                <div>
                  <label className="block text-sm font-medium">Número de tarjeta</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg border-negro bg-blanco-light focus:outline-none focus:border-primary"
                    placeholder="4507990000004905"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium">Mes</label>
                    <input
                      type="text"
                      value={expMonth}
                      onChange={(e) => setExpMonth(e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg border-negro bg-blanco-light focus:outline-none focus:border-primary"
                      placeholder="12"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium">Año</label>
                    <input
                      type="text"
                      value={expYear}
                      onChange={(e) => setExpYear(e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg border-negro bg-blanco-light focus:outline-none focus:border-primary"
                      placeholder="25"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg border-negro bg-blanco-light focus:outline-none focus:border-primary"
                    placeholder="123"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Confirmar pago
                </button>
              </form>
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
                      src={item.images[0].url || "/placeholder.svg"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="w-15 h-15 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                      <p className="text-sm font-medium">{formatPrice(item.sellingPrice)}</p>
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