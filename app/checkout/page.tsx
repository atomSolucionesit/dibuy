"use client";

import { useState, useEffect } from "react";
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
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Map,
  Loader2,
  Search,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { createSale, updateSale } from "@/api/sales/saleService";
import { createCustomer } from "@/api/customers/customerService";
import {
  createToken,
  createPayment,
  getInstallmentOptions,
  getPaymentStatus,
} from "@/services/payments";
import { getPaymentMethodId } from "@/lib/cardUtils";
import { getCarriers } from "@/api/shipping/shippingService";
import { createModoCheckout } from "@/services/modo";
//import { useDeviceFingerprint } from "@/services/useDeviceFingerprint"

const paymentMethods = [
  { id: "credit", name: "Tarjeta de crédito", icon: CreditCard },
  { id: "debit", name: "Tarjeta de débito", icon: CreditCard },
  { id: "transfer", name: "Transferencia bancaria", icon: CreditCard },
  // label follows MODO guidelines ("MODO y Apps Bancarias")
  // { id: "modo", name: "MODO y Apps Bancarias", icon: CreditCard },
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
  {
    id: "branch",
    name: "Retiro en sucursal",
    price: 0,
    time: "Retirás en la sucursal",
  },
];

const DEFAULT_INSTALLMENTS = [1, 3, 6, 9, 12];

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
  const [construction, setConstruction] = useState(false);
  const [cvv, setCvv] = useState("");
  const [installmentsOptions, setInstallmentsOptions] =
    useState<number[]>(DEFAULT_INSTALLMENTS);
  const [selectedInstallments, setSelectedInstallments] = useState<number>(1);
  // shipping map state
  const [lat, setLat] = useState<string | null>(null);
  const [lng, setLng] = useState<string | null>(null);
  const [mapUrl, setMapUrl] = useState<string | null>(null);
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const [carriers, setCarriers] = useState<any[]>([]);
  const [selectedCarrier, setSelectedCarrier] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // MODO payment integration
  useEffect(() => {
    const script = document.createElement("script");
    const src =
      process.env.NODE_ENV === "production"
        ? "https://ecommerce-modal.modo.com.ar/bundle.js"
        : "https://ecommerce-modal.preprod.modo.com.ar/bundle.js";
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const createPaymentIntention = async () => {
    // use the central service rather than a fetch to the frontend
    const json = await createModoCheckout(total);
    return {
      checkoutId: json.id,
      qrString: json.qr,
      deeplink: json.deeplink,
    };
  };

  const showModal = async () => {
    console.log(
      "Modo script env",
      process.env.NODE_ENV === "production" ? "prod" : "preprod",
    );
    const modalData = await createPaymentIntention();
    const modalObject: any = {
      version: "2",
      qrString: modalData.qrString,
      checkoutId: modalData.checkoutId,
      deeplink: {
        url: modalData.deeplink,
        callbackURL: window.location.href,
        callbackURLSuccess: window.location.origin + "/payment/success",
      },
      callbackURL: window.location.origin + "/payment/success",
      refreshData: createPaymentIntention,
      onSuccess: () => {
        console.log("modo success");
        router.push("/payment/success");
      },
      onFailure: () => {
        console.log("modo failure");
        router.push("/payment/failure");
      },
    };
    // @ts-ignore
    window.ModoSDK?.modoInitPayment(modalObject);
  };

  useEffect(() => {
    const fetchCarriersData = async () => {
      const data = await getCarriers();
      if (data && Array.isArray(data)) {
        setCarriers(data);
        if (state.shipping?.carrierId) {
          setSelectedCarrier(state.shipping.carrierId);
        } else if (data.length > 0) {
          setSelectedCarrier(
            data.find((c: any) => c.isDefault)?.id || data[0].id,
          );
        }
      }
    };
    fetchCarriersData();
  }, []);

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

  // textos específicos para MODO
  const modoCta = "REALIZAR PAGO";

  // Paso 1: personal info submit -> avanzar a envío
  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    // if pickup, create sale immediately (no shippingAddress) and skip to payment
    if (formData.shippingMethod === "branch") {
      try {
        // create customer
        const customer = await createCustomer({
          name: formData.firstName,
          lastName: formData.lastName,
          documentNumber: formData.dni,
          phone: formData.phone,
          email: formData.email,
        });

        const customerId = customer?.info?.id;
        if (!customerId) throw new Error("Customer ID no disponible");

        // build minimal sale payload (no shippingAddress)
        const salePayload: any = {
          customerId,
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
            selectedColor: item.selectedColor || null,
            productVariantId: item.selectedVariantCombinationId || null,
            productVariantName: item.selectedVariantName || null,
          })),
          preferredPaymentMethod: formData.paymentMethod,
        };

        const sale = await createSale(salePayload);
        setSaleId(sale.info.id);
        setStep(3);
      } catch (err) {
        console.error(err);
        alert("Error al crear la venta para retiro en sucursal");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setStep(2);
      setIsSubmitting(false);
    }
  };

  // Paso 2: crear venta (incluye datos de envío) y avanzar a pago
  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const customer = await createCustomer({
        name: formData.firstName,
        lastName: formData.lastName,
        documentNumber: formData.dni,
        phone: formData.phone,
        email: formData.email,
      });

      const customerId = customer?.info?.id;
      if (!customerId) {
        throw new Error("Customer ID no disponible");
      }

      // build payload
      const salePayload: any = {
        customerId,
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
      };

      if (formData.shippingMethod !== "branch") {
        salePayload.shippingAddress = {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          latitude: lat,
          longitude: lng,
        };
        salePayload.carrierId = selectedCarrier;
      }

      salePayload.preferredPaymentMethod = formData.paymentMethod;

      salePayload.details = state.items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.sellingPrice,
        discount: 0,
        selectedColor: item.selectedColor || null,
        productVariantId: item.selectedVariantCombinationId || null,
        productVariantName: item.selectedVariantName || null,
      }));

      const sale = await createSale(salePayload);

      setSaleId(sale.info.id);
      try {
        const options = await getInstallmentOptions();
        const normalized = (
          Array.isArray(options) && options.length > 0
            ? options
            : DEFAULT_INSTALLMENTS
        ).filter((value) => DEFAULT_INSTALLMENTS.includes(Number(value)));

        const finalOptions =
          normalized.length > 0 ? normalized : DEFAULT_INSTALLMENTS;
        setInstallmentsOptions(finalOptions);
        setSelectedInstallments(finalOptions[0]);
      } catch (error) {
        setInstallmentsOptions(DEFAULT_INSTALLMENTS);
        setSelectedInstallments(1);
      }
      setStep(3);
    } catch (err) {
      console.error(err);
      alert("Error al crear la venta");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Paso 2: procesar pago
  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    // if the user selected MODO we shouldn't handle here
    if (formData.paymentMethod === "modo") {
      return;
    }
    if (!saleId) {
      console.error("Sale ID no disponible");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
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
      const newTotal = total;

      const payment: any = await createPayment(
        token,
        newTotal,
        saleId,
        saleId /*aca va el fignerprint*/,
        getPaymentMethodId(cardNumber),
        selectedInstallments,
        cardNumber.replace(/\s/g, "").slice(0, 6),
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
    } finally {
      setIsSubmitting(false);
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-6 order-1 lg:order-1">
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
                        Envío
                      </span>
                    </div>

                    <div className="flex-1 h-px bg-gray-200 mx-4"></div>

                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step >= 3
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step > 3 ? <CheckCircle className="h-5 w-5" /> : "3"}
                      </div>
                      <span
                        className={step >= 3 ? "font-medium" : "text-gray-500"}
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
                    <form onSubmit={handlePersonalSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Nombre
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
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
                              className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Apellido
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
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
                              className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            DNI
                          </label>
                          <div className="relative">
                            <Shield className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              required
                              value={formData.dni}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  dni: e.target.value,
                                })
                              }
                              className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
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
                              className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Teléfono
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
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
                              className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          Método de envío
                        </label>
                        <select
                          required
                          value={formData.shippingMethod}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shippingMethod: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                          {shippingMethods.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative overflow-hidden w-full bg-gradient-primary text-white px-6 py-4 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Procesando...</span>
                          </>
                        ) : (
                          <span className="relative z-10">
                            Continuar al envío
                          </span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </button>
                    </form>
                  </div>
                )}

                {/* Step 2: Shipping (address + map) */}
                {step === 2 && formData.shippingMethod !== "branch" && (
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">
                      Dirección de envío
                    </h2>
                    <form onSubmit={handleCreateSale} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                          Dirección
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
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
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Ciudad
                          </label>
                          <div className="relative">
                            <Building className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                              type="text"
                              required
                              value={formData.city}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  city: e.target.value,
                                })
                              }
                              className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700">
                            Código postal
                          </label>
                          <div className="relative">
                            <Map className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
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
                              className="w-full pl-11 pr-4 py-3 border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {carriers.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Empresa de correo (Carrier)
                          </label>
                          <select
                            value={selectedCarrier || ""}
                            onChange={(e) =>
                              setSelectedCarrier(Number(e.target.value))
                            }
                            className="w-full px-4 py-3 border border-negro bg-blanco-light rounded-lg focus:outline-none focus:border-primary"
                            required
                          >
                            {carriers.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} {c.type ? `(${c.type})` : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={async () => {
                            // geocode address using Nominatim
                            try {
                              setIsSearchingMap(true);
                              const q = `${formData.address}, ${formData.city}, ${formData.postalCode}`;
                              const res = await fetch(
                                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`,
                                { headers: { "Accept-Language": "es" } },
                              );
                              const results = await res.json();
                              if (results && results.length) {
                                const r = results[0];
                                setLat(r.lat);
                                setLng(r.lon);
                                setMapUrl(
                                  `https://staticmap.openstreetmap.de/staticmap.php?center=${r.lat},${r.lon}&zoom=15&size=600x400&markers=${r.lat},${r.lon},red-pushpin`,
                                );
                              } else {
                                alert(
                                  "No se encontraron coordenadas para esa dirección",
                                );
                              }
                            } catch (err) {
                              console.error(err);
                              alert("Error al buscar la dirección");
                            } finally {
                              setIsSearchingMap(false);
                            }
                          }}
                          className="px-4 py-2 bg-magenta text-white rounded-lg"
                        >
                          {isSearchingMap ? "Buscando..." : "Buscar en mapa"}
                        </button>

                        <div className="text-sm text-gray-600">
                          {lat && lng ? (
                            <span>
                              Lat: {lat} • Lng: {lng}
                            </span>
                          ) : (
                            <span>No se han obtenido coordenadas</span>
                          )}
                        </div>
                      </div>

                      {lat && lng ? (
                        <div className="mt-4 h-64 w-full rounded-md overflow-hidden border">
                          <iframe
                            title="Mapa de dirección"
                            src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                            width="100%"
                            height="100%"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      ) : mapUrl ? (
                        <div className="mt-4">
                          <img
                            src={mapUrl}
                            alt="Mapa de dirección"
                            className="w-full rounded-md border"
                          />
                        </div>
                      ) : null}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative overflow-hidden w-full bg-gradient-primary text-white px-6 py-4 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Procesando...</span>
                          </>
                        ) : (
                          <span className="relative z-10">
                            Continuar con pago
                          </span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      </button>
                    </form>
                  </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <div className="space-y-6 bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-6">Pago</h2>
                    {/* método de pago */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {paymentMethods.map((m) => (
                        <label
                          key={m.id}
                          className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            formData.paymentMethod === m.id
                              ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                              : "border-gray-200 hover:border-primary/50 hover:bg-gray-50 bg-white"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={m.id}
                            className="sr-only"
                            checked={formData.paymentMethod === m.id}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                paymentMethod: e.target.value,
                              })
                            }
                          />
                          <div
                            className={`flex items-center justify-center p-2 rounded-lg ${
                              formData.paymentMethod === m.id
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <m.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-sm font-semibold text-gray-800">
                            {m.id === "modo" ? (
                              <div className="flex items-center gap-2">
                                <Image
                                  src="/modo/Logo_modo.svg"
                                  alt="MODO"
                                  width={24}
                                  height={24}
                                  className="inline-block"
                                />
                                <span>{m.name}</span>
                              </div>
                            ) : (
                              m.name
                            )}
                          </div>
                          {formData.paymentMethod === m.id && (
                            <div className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white shadow-sm animate-in fade-in zoom-in duration-200">
                              <CheckCircle className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </label>
                      ))}
                    </div>

                    {formData.paymentMethod === "modo" ? (
                      <>
                        <div className="mb-4 p-4 bg-gray-100 rounded-md text-sm">
                          {isMobile
                            ? "Al avanzar con el pago seleccioná la app de tu banco"
                            : "Al avanzar con el pago escaneá el QR con la app de tu banco"}
                        </div>
                        <div className="pt-6">
                          <button
                            type="button"
                            onClick={showModal}
                            className="w-full bg-magenta text-white py-4 rounded-lg font-medium hover:opacity-90 transition-colors duration-200"
                          >
                            {modoCta}
                          </button>
                        </div>
                      </>
                    ) : (
                      <form
                        onSubmit={handleProcessPayment}
                        className="space-y-6"
                      >
                        <h2 className="text-xl font-bold mb-6">
                          Datos de tarjeta
                        </h2>

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
                                  e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 16),
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
                                const month = (i + 1)
                                  .toString()
                                  .padStart(2, "0");
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
                                    e.target.value
                                      .replace(/\D/g, "")
                                      .slice(0, 3),
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
                        <div>
                          <label className="block text-sm font-medium mb-3 text-gray-700">
                            ¿En cuántas cuotas?
                          </label>
                          <div className="space-y-3">
                            {installmentsOptions.map((quota) => {
                              const amountPerQuota = total / quota;
                              return (
                                <label
                                  key={quota}
                                  className={`relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                    selectedInstallments === quota
                                      ? "border-primary bg-primary/5 shadow-md scale-[1.01]"
                                      : "border-gray-200 hover:border-primary/50 hover:bg-gray-50 bg-white"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name="installments"
                                    value={quota}
                                    className="sr-only"
                                    checked={selectedInstallments === quota}
                                    onChange={() =>
                                      setSelectedInstallments(quota)
                                    }
                                  />
                                  <div className="flex-1">
                                    <div className="font-bold text-gray-800 text-base">
                                      {quota} cuota{quota > 1 ? "s" : ""}
                                    </div>
                                    <div className="text-sm font-medium mt-0.5 text-primary">
                                      {quota === 1
                                        ? "Sin interés"
                                        : `de ${formatPrice(amountPerQuota)}`}
                                    </div>
                                  </div>
                                  {selectedInstallments === quota ? (
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white shadow-sm animate-in fade-in zoom-in duration-200">
                                      <CheckCircle className="w-4 h-4" />
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300"></div>
                                  )}
                                </label>
                              );
                            })}
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
                          disabled={isSubmitting}
                          className="w-full relative group overflow-hidden bg-primary text-white py-4 rounded-lg font-medium hover:bg-primary-dark transition-all duration-300 shadow-lg hover:shadow-xl mt-6 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>Procesando pago...</span>
                            </>
                          ) : (
                            <span className="relative z-10 flex items-center gap-2">
                              <CreditCard className="h-5 w-5" />
                              Confirmar pago seguro
                            </span>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1 order-2 lg:order-2 mt-8 lg:mt-0">
                <div className="space-y-6 sticky top-24">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">
                      Resumen del pedido
                    </h2>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Shield className="h-4 w-4 text-green-600" />
                      <p className="text-sm text-gray-600">
                        Tus datos están protegidos con encriptación SSL
                      </p>
                    </div>
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
                            {item.selectedVariantName && (
                              <p className="text-sm text-gray-500">
                                Variante: {item.selectedVariantName}
                              </p>
                            )}
                            {item.selectedColor && (
                              <p className="text-sm text-gray-500">
                                Color: {item.selectedColor}
                              </p>
                            )}
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
                          <p className="font-medium text-sm">
                            Garantía oficial
                          </p>
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
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}
