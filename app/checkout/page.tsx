"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  CreditCard,
  Truck,
  Shield,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { createSale, updateSale } from "@/api/sales/saleService";
import {
  createToken,
  createPayment,
  getPaymentStatus,
} from "@/services/payments";
//import { useDeviceFingerprint } from "@/services/useDeviceFingerprint"

const paymentMethods = [
  { id: "credit", name: "Tarjeta de crédito", icon: CreditCard },
  { id: "debit", name: "Tarjeta de débito", icon: CreditCard },
  { id: "transfer", name: "Transferencia bancaria", icon: CreditCard },
];

const shippingMethods = [
  {
    id: "standard",
    name: "Envío estándar",
    price: 0,
    time: "3-5 días hábiles",
  },
  {
    id: "express",
    name: "Envío express",
    price: 5000,
    time: "1-2 días hábiles",
  },
  { id: "premium", name: "Envío premium", price: 10000, time: "Mismo día" },
];

export default function CheckoutPage() {
  //const deviceFingerprintId = useDeviceFingerprint();
  const router = useRouter();
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [saleId, setSaleId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "credit",
    shippingMethod: "standard",
  });

  // Datos de tarjeta
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [construction, setConstruction] = useState(true);
  const [cvv, setCvv] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const selectedShipping = shippingMethods.find(
    (m) => m.id === formData.shippingMethod,
  );
  const subtotal = state.total;
  const shipping = selectedShipping?.price || 0;
  const envio = state.shipping;
  const total = subtotal + (envio?.price || 0);

  // Paso 1: crear venta
  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sale = await createSale({
        total,
        subTotal: subtotal,
        taxAmount: 0,
        status: "PENDING",
        origin: "TIENDA",
        receiptTypeId: 1,
        documentTypeId: 1,
        currencyId: 1,
        paymentCharge: {
          amountPaid: 0,
          turned: 0,
          isCredit: true,
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
    if (!saleId) {
      console.error("Sale ID no disponible");
      return;
    }
    try {
      // 1. Tokenizar tarjeta
      const tokenData = await createToken({
        card_number: cardNumber,
        card_expiration_month: expMonth,
        card_expiration_year: expYear,
        security_code: cvv,
        card_holder_name: `${formData.firstName.toUpperCase()} ${formData.lastName.toUpperCase()}`,
        card_holder_identification: {
          type: "DNI",
          number: formData.dni, // pedís este campo en tu form
        },
      });

      const token = tokenData.id;

      // 2. Crear pago
      const newTotal = Math.round(total * 100);

      const payment: any = await createPayment(
        token,
        newTotal,
        saleId,
        saleId /*aca va el fignerprint*/,
      );

      // 3. Actualizar venta en backend
      if (payment.data?.status === "approved") {
        //await updateSale(saleId, { status: "COMPLETED" })
        clearCart();
        router.push("/payment/success");
      } else {
        clearCart();
        router.push("/payment/failure");
      }
    } catch (err) {
      console.error(err);
      alert("Error al procesar el pago");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {construction ? (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <p className="font-bold">Página en construcción</p>
          <p>
            Estamos trabajando para mejorar tu experiencia de compra. ¡Gracias
            por tu paciencia!
          </p>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-primary text-white py-12">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Finalizar compra
                </h1>
                <p className="text-lg opacity-90">
                  Completa tu pedido de forma segura
                </p>
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
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step >= 1
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
                      </div>
                      <span
                        className={step >= 1 ? "font-medium" : "text-gray-500"}
                      >
                        Datos personales
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-gray-200 mx-4"></div>
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step >= 2
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step > 2 ? <CheckCircle className="h-5 w-5" /> : "2"}
                      </div>
                      <span
                        className={step >= 2 ? "font-medium" : "text-gray-500"}
                      >
                        Pago
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">
                      Información personal
                    </h2>
                    <form onSubmit={handleCreateSale} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Nombre
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Apellido
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            DNI
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.dni}
                            onChange={(e) =>
                              setFormData({ ...formData, dni: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Dirección
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Ciudad
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.city}
                            onChange={(e) =>
                              setFormData({ ...formData, city: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Código postal
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.postalCode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                postalCode: e.target.value,
                              })
                            }
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
                  <form
                    onSubmit={handleProcessPayment}
                    className="space-y-6 bg-white rounded-xl p-6 shadow-sm"
                  >
                    <h2 className="text-xl font-bold mb-6">Datos de tarjeta</h2>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Número de tarjeta
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) =>
                            setCardNumber(
                              e.target.value.replace(/\D/g, "").slice(0, 16),
                            )
                          }
                          className="w-full pl-12 pr-4 py-3 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="•••• •••• •••• ••••"
                          pattern="\d{16}"
                          maxLength={16}
                          required
                          autoComplete="cc-number"
                        />
                        <CreditCard className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <label className="block text-sm font-medium mb-2">
                          Mes
                        </label>
                        <select
                          value={expMonth}
                          onChange={(e) => setExpMonth(e.target.value)}
                          className="w-full bg-white text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, "0");
                            return (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium mb-2">
                          Año
                        </label>
                        <select
                          value={expYear}
                          onChange={(e) => setExpYear(e.target.value)}
                          className="w-full bg-white text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          required
                        >
                          <option value="">YY</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = (new Date().getFullYear() + i)
                              .toString()
                              .slice(-2);
                            return (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium mb-2">
                          CVV
                          <span className="ml-1 text-gray-400 text-xs">
                            (3 dígitos)
                          </span>
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            value={cvv}
                            onChange={(e) =>
                              setCvv(
                                e.target.value.replace(/\D/g, "").slice(0, 3),
                              )
                            }
                            className="w-full bg-white text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            pattern="\d{3}"
                            maxLength={3}
                            required
                            autoComplete="cc-csc"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <Shield className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payway Security Section */}
                    <div className="bg-gray-50 p-6 rounded-lg border mt-8">
                      <div className="flex items-center justify-center mb-4">
                        <Image
                          src="https://cdn.atomsolucionesit.com.ar/media/dibuy/payway.svg"
                          alt="Payway - Procesamiento seguro"
                          width={140}
                          height={50}
                          className="h-10 w-auto"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <Shield className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-gray-600">
                          Tus datos están protegidos con encriptación SSL
                        </p>
                      </div>
                      <div className="text-center">
                        <a
                          href="https://cdn.atomsolucionesit.com.ar/media/dibuy/Declaraci%C3%B3n%20sobre%20el%20uso%20de%20medios%20de%20pago%20y%20procesamiento%20de%20transacciones.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary-dark underline"
                        >
                          Ver declaración de procesamiento de pagos
                        </a>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary text-white py-4 rounded-lg font-medium hover:bg-primary-dark transition-colors duration-200 mt-6 flex items-center justify-center gap-2"
                    >
                      <CreditCard className="h-5 w-5" />
                      <span>Confirmar pago seguro</span>
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
                          src={item.images[0]?.url || "/placeholder.svg"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="w-15 h-15 object-cover rounded-lg bg-gray-100"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            Cantidad: {item.quantity}
                          </p>
                          <p className="text-sm font-medium">
                            {formatPrice(item.sellingPrice)}
                          </p>
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
                      <span>
                        {envio
                          ? `${envio.name} - ${formatPrice(envio.price)}`
                          : "-"}
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-primary">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold mb-4">
                    Beneficios de tu compra
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Envío seguro</p>
                        <p className="text-xs text-gray-500">
                          Seguimiento en tiempo real
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Garantía oficial</p>
                        <p className="text-xs text-gray-500">
                          12 meses de garantía
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RotateCcw className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">
                          Devolución gratuita
                        </p>
                        <p className="text-xs text-gray-500">Hasta 30 días</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </div>
  );
}
