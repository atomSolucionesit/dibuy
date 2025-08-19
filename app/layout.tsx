import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/CartContext"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "DIBUY - Tu tienda de tecnología",
  description:
    "Descubre los mejores productos tecnológicos al mejor precio. Smartphones, laptops, tablets y más con envío gratis.",
  keywords: "tecnología, smartphones, laptops, tablets, accesorios, gaming, ofertas",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-balgin`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
