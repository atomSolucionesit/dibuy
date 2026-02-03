"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Lock, ArrowLeft, Shield, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/contexts/CartContext"
import { createNexusPayment, getNexusPaymentStatus, processNexusPayment } from "@/services/nexusPayments"
import { mapDibuyToNexusSale } from "@/lib/nexusConfig"
import { getPaymentMethodId, getCardBrand } from "@/lib/cardUtils"

export default function PaymentPage() {
  const router = useRouter()
  const { clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [checkoutData, setCheckoutData] = useState<any>(null)
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [holderName, setHolderName] = useState("")
  const [holderDni, setHolderDni] = useState("")
  const [detectedCard, setDetectedCard] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isFormValid, setIsFormValid] = useState(false)


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

  // Validaciones
  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '')
    if (cleaned.length < 13 || cleaned.length > 19) {
      return "Número de tarjeta inválido"
    }
    if (!/^\d+$/.test(cleaned)) {
      return "Solo se permiten números"
    }
    return ""
  }

  const validateExpiryDate = (date: string) => {
    if (!/^\d{2}\/\d{2}$/.test(date)) {
      return "Formato inválido (MM/AA)"
    }
    const [month, year] = date.split('/')
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1
    
    if (parseInt(month) < 1 || parseInt(month) > 12) {
      return "Mes inválido"
    }
    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      return "Tarjeta vencida"
    }
    return ""
  }

  const validateCvv = (cvv: string) => {
    if (cvv.length < 3 || cvv.length > 4) {
      return "CVV debe tener 3 o 4 dígitos"
    }
    if (!/^\d+$/.test(cvv)) {
      return "Solo se permiten números"
    }
    return ""
  }

  const validateHolderName = (name: string) => {
    if (name.length < 2) {
      return "Nombre muy corto"
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
      return "Solo se permiten letras"
    }
    return ""
  }

  const validateDni = (dni: string) => {
    if (dni.length < 7 || dni.length > 8) {
      return "DNI debe tener 7 u 8 dígitos"
    }
    if (!/^\d+$/.test(dni)) {
      return "Solo se permiten números"
    }
    return ""
  }

  // Formatear número de tarjeta
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ')
    return formatted
  }

  // Formatear fecha de vencimiento
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4)
    }
    return cleaned
  }

  // Validar formulario completo
  useEffect(() => {
    const newErrors: Record<string, string> = {}
    
    if (cardNumber) newErrors.cardNumber = validateCardNumber(cardNumber)
    if (expiryDate) newErrors.expiryDate = validateExpiryDate(expiryDate)
    if (cvv) newErrors.cvv = validateCvv(cvv)
    if (holderName) newErrors.holderName = validateHolderName(holderName)
    if (holderDni) newErrors.holderDni = validateDni(holderDni)
    
    setErrors(newErrors)
    
    const hasErrors = Object.values(newErrors).some(error => error !== "")
    const allFieldsFilled = cardNumber && expiryDate && cvv && holderName && holderDni
    
    setIsFormValid(!hasErrors && !!allFieldsFilled)
  }, [cardNumber, expiryDate, cvv, holderName, holderDni])

  
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

              <div className="space-y-6">
                <div className="space-y-4">
                  {/* Número de tarjeta */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Número de tarjeta *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatCardNumber(cardNumber)}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '')
                          setCardNumber(value)
                          if (value.length >= 6) {
                            setDetectedCard(getCardBrand(value))
                          } else {
                            setDetectedCard("")
                          }
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`w-full p-4 border-2 rounded-xl text-lg font-mono transition-all duration-200 ${
                          errors.cardNumber 
                            ? 'border-red-300 bg-red-50 focus:border-red-500' 
                            : cardNumber && !errors.cardNumber
                            ? 'border-green-300 bg-green-50 focus:border-green-500'
                            : 'border-gray-200 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                        required
                      />
                      {detectedCard && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm font-medium text-green-600">{detectedCard}</span>
                        </div>
                      )}
                    </div>
                    {errors.cardNumber && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.cardNumber}
                      </div>
                    )}
                  </div>

                  {/* Vencimiento y CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Vencimiento *</label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        placeholder="MM/AA"
                        maxLength={5}
                        className={`w-full p-4 border-2 rounded-xl text-lg font-mono transition-all duration-200 ${
                          errors.expiryDate 
                            ? 'border-red-300 bg-red-50 focus:border-red-500' 
                            : expiryDate && !errors.expiryDate
                            ? 'border-green-300 bg-green-50 focus:border-green-500'
                            : 'border-gray-200 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                        required
                      />
                      {errors.expiryDate && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <AlertCircle className="h-3 w-3" />
                          {errors.expiryDate}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">CVV *</label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        maxLength={4}
                        className={`w-full p-4 border-2 rounded-xl text-lg font-mono transition-all duration-200 ${
                          errors.cvv 
                            ? 'border-red-300 bg-red-50 focus:border-red-500' 
                            : cvv && !errors.cvv
                            ? 'border-green-300 bg-green-50 focus:border-green-500'
                            : 'border-gray-200 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                        required
                      />
                      {errors.cvv && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <AlertCircle className="h-3 w-3" />
                          {errors.cvv}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nombre del titular */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Nombre del titular *</label>
                    <input
                      type="text"
                      value={holderName}
                      onChange={(e) => setHolderName(e.target.value.toUpperCase())}
                      placeholder="JUAN PEREZ"
                      className={`w-full p-4 border-2 rounded-xl text-lg transition-all duration-200 ${
                        errors.holderName 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : holderName && !errors.holderName
                          ? 'border-green-300 bg-green-50 focus:border-green-500'
                          : 'border-gray-200 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                      required
                    />
                    {errors.holderName && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.holderName}
                      </div>
                    )}
                  </div>

                  {/* DNI del titular */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">DNI del titular *</label>
                    <input
                      type="text"
                      value={holderDni}
                      onChange={(e) => setHolderDni(e.target.value.replace(/\D/g, ''))}
                      placeholder="12345678"
                      maxLength={8}
                      className={`w-full p-4 border-2 rounded-xl text-lg font-mono transition-all duration-200 ${
                        errors.holderDni 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : holderDni && !errors.holderDni
                          ? 'border-green-300 bg-green-50 focus:border-green-500'
                          : 'border-gray-200 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                      required
                    />
                    {errors.holderDni && (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {errors.holderDni}
                      </div>
                    )}
                  </div>
                </div>

                {/* Payway Security Section */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-center mb-4">
                    <Image
                      src="https://cdn.atomsolucionesit.com.ar/media/dibuy/payway.svg"
                      alt="Payway - Procesamiento seguro"
                      width={140}
                      height={45}
                      className="h-10 w-auto"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-semibold text-blue-800">
                      Tus datos están protegidos con encriptación SSL
                    </p>
                  </div>
                  <div className="text-center">
                    <a
                      href="https://cdn.atomsolucionesit.com.ar/media/dibuy/Declaraci%C3%B3n%20sobre%20el%20uso%20de%20medios%20de%20pago%20y%20procesamiento%20de%20transacciones.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-700 hover:text-blue-900 underline font-medium transition-colors"
                    >
                      Ver declaración de procesamiento de pagos
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loading || !isFormValid}
                  onClick={async () => {
                    if (!isFormValid) return
                    
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
                  className={`w-full px-6 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ${
                    isFormValid && !loading
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Procesando pago...
                    </div>
                  ) : (
                    `Pagar ${formatPrice(total)}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}