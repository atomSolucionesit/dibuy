"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    FPUtils: any
  }
}

export const useDeviceFingerprint = () => {
  const [deviceFingerprintId, setDeviceFingerprintId] = useState<string | null>(null)

  useEffect(() => {
    if (!window.FPUtils) {
      console.warn("fraud-prevention.js todavía no cargó")
      return
    }

    try {
      const siteId = process.env.NEXT_PUBLIC_PAYWAY_SITE_ID
      const fp = new window.FPUtils(siteId)
      const data = fp.getData()

      console.log("Fingerprint generado:", data)
      setDeviceFingerprintId(data.deviceFingerprintId)
    } catch (err) {
      console.error("Error al inicializar fingerprint:", err)
    }
  }, [])

  return deviceFingerprintId
}
