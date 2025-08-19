"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const contactInfo = [
  {
    icon: Phone,
    title: "Teléfono",
    content: "+54 11 1234-5678",
    description: "Lun a Vie 9:00 - 18:00"
  },
  {
    icon: Mail,
    title: "Email",
    content: "info@dibuy.com",
    description: "Respondemos en 24h"
  },
  {
    icon: MapPin,
    title: "Dirección",
    content: "Av. Corrientes 1234",
    description: "Buenos Aires, Argentina"
  },
  {
    icon: Clock,
    title: "Horarios",
    content: "Lun a Vie 9:00 - 18:00",
    description: "Sáb 9:00 - 13:00"
  }
]

const faqs = [
  {
    question: "¿Cuáles son los métodos de pago aceptados?",
    answer: "Aceptamos tarjetas de crédito y débito, transferencias bancarias y efectivo en puntos de retiro."
  },
  {
    question: "¿Cuánto tiempo tarda el envío?",
    answer: "El envío estándar tarda 3-5 días hábiles. También ofrecemos envío express (1-2 días) y premium (mismo día)."
  },
  {
    question: "¿Tienen garantía en los productos?",
    answer: "Sí, todos nuestros productos tienen garantía oficial de 12 meses y soporte técnico especializado."
  },
  {
    question: "¿Puedo devolver un producto?",
    answer: "Sí, aceptamos devoluciones gratuitas hasta 30 días después de la compra en productos sin usar."
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular envío del formulario
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Contáctanos</h1>
            <p className="text-lg opacity-90">Estamos aquí para ayudarte</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">¡Mensaje enviado!</h3>
                  <p className="text-gray-600">Gracias por contactarnos. Te responderemos pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nombre completo</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Asunto</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="consulta">Consulta general</option>
                      <option value="soporte">Soporte técnico</option>
                      <option value="devolucion">Devolución</option>
                      <option value="facturacion">Facturación</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Mensaje</label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none"
                      placeholder="Cuéntanos cómo podemos ayudarte..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="group relative overflow-hidden w-full bg-gradient-primary text-white px-6 py-4 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <Send className="h-5 w-5" />
                      <span>Enviar mensaje</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>
                </form>
              )}
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Preguntas frecuentes</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Info Cards */}
            <div className="grid gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{info.title}</h3>
                      <p className="text-lg font-medium text-primary mb-1">{info.content}</p>
                      <p className="text-sm text-gray-500">{info.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Ubicación</h3>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Mapa interactivo</p>
                  <p className="text-sm text-gray-400">Av. Corrientes 1234, Buenos Aires</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Horarios de atención</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Lunes a Viernes</span>
                  <span className="font-medium">9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábados</span>
                  <span className="font-medium">9:00 - 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingos</span>
                  <span className="font-medium text-gray-500">Cerrado</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                  <span className="text-sm font-bold">f</span>
                </button>
                <button className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                  <span className="text-sm font-bold">ig</span>
                </button>
                <button className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                  <span className="text-sm font-bold">in</span>
                </button>
                <button className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                  <span className="text-sm font-bold">yt</span>
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