import { useState, useEffect } from "react"
import { CreditCard, Shield, CheckCircle, AlertCircle } from "lucide-react"
import Image from "next/image"
import { getCardBrand } from "@/lib/cardUtils"

interface PaymentFormProps {
  onFormChange: (data: {
    cardNumber: string
    expiryDate: string
    cvv: string
    holderName: string
    holderDni: string
    isValid: boolean
    detectedCard: string
  }) => void
}

export function PaymentFormComponent({ onFormChange }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [holderName, setHolderName] = useState("")
  const [holderDni, setHolderDni] = useState("")
  const [detectedCard, setDetectedCard] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isFormValid, setIsFormValid] = useState(false)

  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, "")
    if (cleaned.length < 13 || cleaned.length > 19) return "Numero de tarjeta invalido"
    if (!/^\d+$/.test(cleaned)) return "Solo se permiten numeros"
    return ""
  }

  const validateExpiryDate = (date: string) => {
    if (!/^\d{2}\/\d{2}$/.test(date)) return "Formato invalido (MM/AA)"
    const [month, year] = date.split("/")
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1

    if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) return "Mes invalido"
    if (
      parseInt(year, 10) < currentYear ||
      (parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth)
    ) {
      return "Tarjeta vencida"
    }

    return ""
  }

  const validateCvv = (value: string) => {
    if (value.length < 3 || value.length > 4) return "CVV debe tener 3 o 4 digitos"
    if (!/^\d+$/.test(value)) return "Solo se permiten numeros"
    return ""
  }

  const validateHolderName = (name: string) => {
    if (name.length < 2) return "Nombre muy corto"
    if (!/^[a-zA-ZA-Za-z\s]+$/.test(name)) return "Solo se permiten letras"
    return ""
  }

  const validateDni = (dni: string) => {
    if (dni.length < 7 || dni.length > 8) return "DNI debe tener 7 u 8 digitos"
    if (!/^\d+$/.test(dni)) return "Solo se permiten numeros"
    return ""
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "")
    return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ")
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`
    }

    return cleaned
  }

  useEffect(() => {
    const newErrors: Record<string, string> = {}

    if (cardNumber) newErrors.cardNumber = validateCardNumber(cardNumber)
    if (expiryDate) newErrors.expiryDate = validateExpiryDate(expiryDate)
    if (cvv) newErrors.cvv = validateCvv(cvv)
    if (holderName) newErrors.holderName = validateHolderName(holderName)
    if (holderDni) newErrors.holderDni = validateDni(holderDni)

    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((error) => error !== "")
    const allFieldsFilled = Boolean(cardNumber && expiryDate && cvv && holderName && holderDni)
    const isValid = !hasErrors && allFieldsFilled

    setIsFormValid(isValid)
    onFormChange({
      cardNumber: cardNumber.replace(/\s/g, ""),
      expiryDate,
      cvv,
      holderName,
      holderDni,
      isValid,
      detectedCard,
    })
  }, [cardNumber, expiryDate, cvv, holderName, holderDni, detectedCard, onFormChange])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <CreditCard className="h-4 w-4" />
            Numero de tarjeta *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formatCardNumber(cardNumber)}
              onChange={(e) => {
                const value = e.target.value.replace(/\s/g, "")
                setCardNumber(value)
                setDetectedCard(value.length >= 6 ? getCardBrand(value) : "")
              }}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={`w-full rounded-xl border-2 p-4 font-mono text-lg transition-all duration-200 ${
                errors.cardNumber
                  ? "border-red-300 bg-red-50 focus:border-red-500"
                  : cardNumber && !errors.cardNumber
                    ? "border-green-300 bg-green-50 focus:border-green-500"
                    : "border-gray-200 focus:border-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-100`}
              required
            />
            {detectedCard && (
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-600">{detectedCard}</span>
              </div>
            )}
          </div>
          {errors.cardNumber && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.cardNumber}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Vencimiento *</label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              placeholder="MM/AA"
              maxLength={5}
              className={`w-full rounded-xl border-2 p-4 font-mono text-lg transition-all duration-200 ${
                errors.expiryDate
                  ? "border-red-300 bg-red-50 focus:border-red-500"
                  : expiryDate && !errors.expiryDate
                    ? "border-green-300 bg-green-50 focus:border-green-500"
                    : "border-gray-200 focus:border-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-100`}
              required
            />
            {errors.expiryDate && (
              <div className="flex items-center gap-1 text-xs text-red-600">
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
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
              placeholder="123"
              maxLength={4}
              className={`w-full rounded-xl border-2 p-4 font-mono text-lg transition-all duration-200 ${
                errors.cvv
                  ? "border-red-300 bg-red-50 focus:border-red-500"
                  : cvv && !errors.cvv
                    ? "border-green-300 bg-green-50 focus:border-green-500"
                    : "border-gray-200 focus:border-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-blue-100`}
              required
            />
            {errors.cvv && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" />
                {errors.cvv}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Nombre del titular *</label>
          <input
            type="text"
            value={holderName}
            onChange={(e) => setHolderName(e.target.value.toUpperCase())}
            placeholder="JUAN PEREZ"
            className={`w-full rounded-xl border-2 p-4 text-lg transition-all duration-200 ${
              errors.holderName
                ? "border-red-300 bg-red-50 focus:border-red-500"
                : holderName && !errors.holderName
                  ? "border-green-300 bg-green-50 focus:border-green-500"
                  : "border-gray-200 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-100`}
            required
          />
          {errors.holderName && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.holderName}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">DNI del titular *</label>
          <input
            type="text"
            value={holderDni}
            onChange={(e) => setHolderDni(e.target.value.replace(/\D/g, ""))}
            placeholder="12345678"
            maxLength={8}
            className={`w-full rounded-xl border-2 p-4 font-mono text-lg transition-all duration-200 ${
              errors.holderDni
                ? "border-red-300 bg-red-50 focus:border-red-500"
                : holderDni && !errors.holderDni
                  ? "border-green-300 bg-green-50 focus:border-green-500"
                  : "border-gray-200 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-100`}
            required
          />
          {errors.holderDni && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.holderDni}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-green-50 p-6">
        <div className="mb-4 flex items-center justify-center">
          <Image
            src="https://cdn.atomsolucionesit.com.ar/media/dibuy/payway.svg"
            alt="Payway - Procesamiento seguro"
            width={140}
            height={45}
            className="h-10 w-auto"
          />
        </div>
        <div className="mb-3 flex items-center justify-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <p className="text-sm font-semibold text-blue-800">
            Tus datos estan protegidos con encriptacion SSL
          </p>
        </div>
        <div className="text-center">
          <a
            href="https://cdn.atomsolucionesit.com.ar/media/dibuy/Declaracion%20sobre%20el%20uso%20de%20medios%20de%20pago%20y%20procesamiento%20de%20transacciones.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-700 underline transition-colors hover:text-blue-900"
          >
            Ver declaracion de procesamiento de pagos
          </a>
        </div>
      </div>
    </div>
  )
}
