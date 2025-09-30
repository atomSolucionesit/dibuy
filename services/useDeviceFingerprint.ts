"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    CybersourceFP?: {
      getDeviceFingerprint: (options: {
        company_id: string
        callback: (res: { device_unique_id: string }) => void
      }) => void
    }
  }
}

export const useDeviceFingerprint = () => {
  const [deviceUniqueId, setDeviceUniqueId] = useState<string | null>(null)

  useEffect(() => {
    const companyId = process.env.NEXT_PUBLIC_PAYWAY_COMPANY_ID

    if (!companyId) {
      console.error("Falta NEXT_PUBLIC_PAYWAY_COMPANY_ID en .env")
      return
    }

    if (!window.CybersourceFP) {
      console.warn("fingerprint.js todavía no cargó")
      return
    }

    window.CybersourceFP.getDeviceFingerprint({
      company_id: companyId,
      callback: (res) => {
        console.log("Fingerprint generado:", res.device_unique_id)
        setDeviceUniqueId(res.device_unique_id)
      },
    })
  }, [])

  return deviceUniqueId
}
