import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RotateCcw, CheckCircle, XCircle } from "lucide-react";

export default function DevolucionesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blanco to-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-magenta to-zafiro rounded-full mb-6">
              <RotateCcw className="h-8 w-8 text-blanco" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-negro mb-4">
              Política de Devoluciones
            </h1>
            <p className="text-lg text-gray-600">
              Conoce nuestras condiciones para devoluciones y cambios
            </p>
          </div>

          {/* Content */}
          <div className="bg-blanco rounded-2xl shadow-lg p-8 md:p-12">
            <div className="space-y-8">
              {/* Condiciones principales */}
              <div>
                <h2 className="text-2xl font-bold text-negro mb-6">
                  Condiciones Generales
                </h2>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">
                        Productos Aceptados
                      </h3>
                      <p className="text-green-700">
                        Aceptamos devoluciones únicamente de productos que se
                        encuentren en
                        <strong> perfectas condiciones</strong>, sin uso, con
                        embalaje original y todos sus accesorios incluidos.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-red-800 mb-2">
                        Productos No Aceptados
                      </h3>
                      <p className="text-red-700">
                        <strong>No se aceptarán devoluciones</strong> de
                        productos que hayan sido manipulados, usados, dañados o
                        que no conserven su embalaje original. Estos productos
                        no serán cambiados ni devueltos bajo ninguna
                        circunstancia.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proceso de devolución */}
              <div>
                <h2 className="text-2xl font-bold text-negro mb-6">
                  Proceso de Devolución
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-magenta text-blanco rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                      1
                    </div>
                    <h3 className="font-semibold mb-2">Contacto</h3>
                    <p className="text-sm text-gray-600">
                      Comunícate con nosotros dentro de los 30 días corridos
                      desde la fecha en la cual recibiste tu compra
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-zafiro text-blanco rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                      2
                    </div>
                    <h3 className="font-semibold mb-2">Evaluación</h3>
                    <p className="text-sm text-gray-600">
                      Verificamos el estado del producto según nuestras
                      condiciones de trazabilidad
                    </p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-oro text-negro rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                      3
                    </div>
                    <h3 className="font-semibold mb-2">Resolución</h3>
                    <p className="text-sm text-gray-600">
                      Según las condiciones, procesamos el reembolso o cambio si
                      cumple las condiciones
                    </p>
                  </div>
                </div>
              </div>

              {/* Información importante */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-semibold text-yellow-800 mb-3">
                  Información Importante
                </h3>
                <ul className="space-y-2 text-yellow-700 text-sm">
                  <li>
                    • Plazo máximo: 30 días desde la fecha en la cual recibió el
                    producto
                  </li>
                  <li>
                    • El producto debe conservar etiquetas y embalaje original
                  </li>
                  <li>
                    • Los gastos de envío para devolución corren por cuenta del
                    cliente
                  </li>
                  <li>
                    • El reembolso se procesará en 5-10 días hábiles una vez
                    aprobada la devolución
                  </li>
                </ul>
              </div>

              {/* Contacto */}
              <div className="text-center pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-negro mb-4">
                  ¿Necesitas ayuda?
                </h3>
                <p className="text-gray-600 mb-6">
                  Si tienes dudas sobre tu devolución, no dudes en contactarnos
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contacto"
                    className="bg-gradient-to-r from-magenta to-zafiro text-blanco px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Contactar Soporte
                  </a>
                  <a
                    href="/productos"
                    className="border-2 border-magenta text-magenta px-6 py-3 rounded-xl font-semibold hover:bg-magenta hover:text-blanco transition-all duration-300"
                  >
                    Ver Productos
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
