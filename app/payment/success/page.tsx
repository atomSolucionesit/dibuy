"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function PaymentSuccess() {
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()

  useEffect(() => {
    if (countdown === 0) {
      router.push("/")
    }
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown, router])

  return (
    <div className="flex flex-col items-center">
        <Link href="/" className="flex-shrink-0">
            <Image src="/logo.png" alt="DIBUY" width={120} height={40} className="h-60 w-auto" />
        </Link>
        <div className="mt-20">
        <div className="flex flex-col items-center gap-4">
            <CheckCircle className="text-green-500 w-20 h-20" />
            <h1 className="text-4xl font-bold">¡Pago aprobado!</h1>
            <p className="text-gray-600 text-2xl">
            Serás redirigido al inicio en{" "}
            <span className="font-semibold">{countdown}</span> segundos.
            </p>
        </div>
        </div>
    </div>
  )
}
