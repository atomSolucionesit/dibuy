import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MessageCircle, HelpCircle } from "lucide-react";

export default function CentroDeAyudaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blanco to-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-magenta to-zafiro rounded-full mb-6">
              <HelpCircle className="h-8 w-8 text-blanco" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-negro mb-4">
              Centro de Ayuda
            </h1>
            <p className="text-lg text-gray-600">
              Estamos aquí para ayudarte. Contáctanos por el medio que prefieras
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Email */}
            <div className="bg-blanco rounded-2xl shadow-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-magenta to-zafiro rounded-full mb-6">
                <Mail className="h-8 w-8 text-blanco" />
              </div>
              <h2 className="text-2xl font-bold text-negro mb-4">Envíanos un Email</h2>
              <p className="text-gray-600 mb-6">
                Escríbenos y te responderemos a la brevedad
              </p>
              <a
                href="mailto:administracion@comex-consultores.com.ar"
                className="inline-block bg-gradient-to-r from-magenta to-zafiro text-blanco px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Enviar Email
              </a>
              <p className="text-sm text-gray-500 mt-4">
                administracion@comex-consultores.com.ar
              </p>
            </div>

            {/* WhatsApp */}
            <div className="bg-blanco rounded-2xl shadow-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6">
                <MessageCircle className="h-8 w-8 text-blanco" />
              </div>
              <h2 className="text-2xl font-bold text-negro mb-4">Habla por WhatsApp</h2>
              <p className="text-gray-600 mb-6">
                Chatea con nosotros en tiempo real
              </p>
              <a
                href="https://wa.me/5491154707982"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-blanco px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Abrir WhatsApp
              </a>
              <p className="text-sm text-gray-500 mt-4">
                +54 9 11 5470-7982
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blanco rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-negro mb-6 text-center">Horarios de Atención</h3>
            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-negro mb-2">Email</h4>
                <p className="text-gray-600">Respondemos en 24-48 horas</p>
              </div>
              <div>
                <h4 className="font-semibold text-negro mb-2">WhatsApp</h4>
                <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}