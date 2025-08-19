"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Send } from "lucide-react"

export default function Newsletter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí conectarías con tu backend
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <section className="bg-gradient-primary text-blanco py-12 md:py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-magenta/20 via-transparent to-zafiro/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-oro/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amatista/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blanco/10 backdrop-blur-sm rounded-full mb-6">
            <Mail className="h-10 w-10 text-blanco" />
          </div>
          
          <span className="badge-oro text-negro mb-4 inline-block">📧 Newsletter</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Mantente al día con las últimas ofertas
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Suscríbete a nuestro newsletter y recibe ofertas exclusivas, lanzamientos de productos y noticias
            tecnológicas.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
                className="w-full px-4 py-3 rounded-lg text-negro focus:outline-none focus:ring-2 focus:ring-oro bg-blanco/90 backdrop-blur-sm border border-blanco/20"
                required
              />
            </div>
            <button
              type="submit"
              className="group relative overflow-hidden bg-gradient-to-r from-oro to-magenta text-negro px-6 py-3 rounded-lg font-medium hover:from-magenta hover:to-oro hover:text-blanco transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Suscribirse</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-negro/0 via-negro/5 to-negro/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </form>
          
          <p className="text-sm opacity-75 mt-4">
            🔒 No compartimos tu información personal
          </p>
        </div>
      </div>
    </section>
  )
}
