import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, CheckCircle, XCircle, Clock, MapPin, MessageCircle, Instagram } from "lucide-react";

export default function GarantiasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blanco to-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-magenta to-zafiro rounded-full mb-6">
              <Shield className="h-8 w-8 text-blanco" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-negro mb-4">
              🛡️ Documento de Garantía Comercial
            </h1>
            <p className="text-lg text-gray-600">
              Modelo Base para E-commerce
            </p>
          </div>

          <div className="space-y-8">
            {/* Alcance */}
            <div className="bg-blanco rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-negro mb-4">1. Alcance de la Garantía</h2>
              <p className="text-gray-700 mb-4">
                Este documento establece los términos bajo los cuales la empresa brinda garantía comercial a los productos adquiridos a través de nuestro sitio web.
              </p>
              <p className="text-gray-700">
                Aplica únicamente a compras realizadas por consumidores finales y dentro del territorio nacional.
              </p>
            </div>

            {/* Plazo */}
            <div className="bg-blanco rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-negro mb-4">2. Plazo de Garantía</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Cada producto cuenta con un período de garantía indicado en la publicación, la factura o el comprobante de compra, cuyo plazo inicia a partir de la fecha de entrega del producto al cliente.
                </p>
                <p className="text-gray-700">
                  La garantía cubre únicamente fallas de fabricación, defectos de origen o mal funcionamiento no atribuible al uso indebido.
                </p>
              </div>
            </div>

            {/* Qué cubre */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  3. ¿Qué cubre la garantía?
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-green-700">Defectos de fabricación</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-green-700">Fallas internas del producto no causadas por el usuario</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-green-700">Funcionamiento incorrecto dentro del uso normal del producto</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-green-700">Reemplazo del producto o devolución del dinero (según disponibilidad o criterio técnico)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                  <XCircle className="h-6 w-6 mr-2" />
                  4. ¿Qué NO cubre la garantía?
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">Daños provocados por golpes, caídas, agua, humedad o mal uso</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">Desgaste natural por uso (baterías, cables, accesorios, etc.)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">Manipulación, modificación o reparación por terceros</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">Instalación incorrecta o uso fuera de especificaciones del fabricante</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-red-700">Productos con etiquetas de garantía adulteradas o removidas</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Procedimiento */}
            <div className="bg-blanco rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-negro mb-6">5. Procedimiento para solicitar garantía</h2>
              <div className="space-y-4">
                <p className="text-gray-700 font-semibold">Para iniciar un reclamo de garantía, el cliente debe:</p>
                <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                  <li>Presentar el comprobante de compra (digital o físico).</li>
                  <li>Contactarnos a través de nuestros canales oficiales:</li>
                </ol>
                <div className="bg-gray-50 rounded-xl p-6 ml-8">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Instagram className="h-5 w-5 text-magenta" />
                      <span className="text-gray-700">Instagram: @dibuy.importadora</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">WhatsApp: 1154707982</span>
                    </div>
                  </div>
                </div>
                <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4" start={3}>
                  <li>Describir el problema y, de ser necesario, enviar fotos o videos que evidencien la falla.</li>
                </ol>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Nuestro equipo técnico evaluará el caso y responderá dentro de un plazo estimado de 24 a 72 horas hábiles.
                  </p>
                </div>
              </div>
            </div>

            {/* Revisión */}
            <div className="bg-blanco rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-negro mb-6">6. Revisión del producto</h2>
              <div className="space-y-4">
                <p className="text-gray-700 font-semibold">En caso de ser necesario revisar el producto físicamente:</p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-800 font-semibold">El cliente deberá enviarlo a nuestra oficina:</p>
                      <p className="text-yellow-700">Avenida Libertador 5990, oficina 505.</p>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• Una vez recibido, el producto será sometido a evaluación técnica.</li>
                  <li>• El tiempo aproximado de diagnóstico es de 5 a 10 días hábiles.</li>
                </ul>
              </div>
            </div>

            {/* Resolución */}
            <div className="bg-blanco rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-negro mb-6">7. Resolución del Reclamo</h2>
              <div className="space-y-4">
                <p className="text-gray-700 font-semibold">Si la falla está cubierta por la garantía, se podrá aplicar alguna de las siguientes soluciones:</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="text-green-800 font-semibold">Reemplazo del producto por uno igual o similar</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <p className="text-blue-800 font-semibold">Entrega de un crédito a favor para utilizar en la tienda</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                    <p className="text-purple-800 font-semibold">Reintegro del monto pagado, en casos particulares donde no exista stock</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Si el producto no presenta falla o tiene daños no cubiertos por la garantía, se devolverá al cliente en las mismas condiciones.
                </p>
              </div>
            </div>

            {/* Cambio de producto */}
            <div className="bg-blanco rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-negro mb-6">8. Garantía por cambio de producto</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Si el cliente desea cambiar un producto que no presenta falla, podrá hacerlo dentro de los <strong>7 días corridos</strong> desde la entrega, siempre que:
                </p>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• El producto esté sin uso</li>
                  <li>• En su caja original</li>
                  <li>• Con todos sus accesorios, manuales y etiquetas</li>
                </ul>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-orange-800">
                    <strong>Nota:</strong> Los gastos de envío corren por cuenta del cliente.
                  </p>
                </div>
              </div>
            </div>

            {/* Exclusiones */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-negro mb-4">9. Exclusiones legales</h2>
              <p className="text-gray-700">
                Esta garantía comercial no sustituye ni limita los derechos del consumidor establecidos por la legislación vigente en materia de defensa del consumidor.
              </p>
            </div>

            {/* Contacto */}
            <div className="bg-gradient-to-r from-magenta to-zafiro rounded-2xl p-8 text-blanco text-center">
              <h2 className="text-2xl font-bold mb-6">10. Contacto Oficial</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Instagram className="h-8 w-8" />
                  <p className="font-semibold">Instagram</p>
                  <p>@dibuy.importadora</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <MessageCircle className="h-8 w-8" />
                  <p className="font-semibold">WhatsApp</p>
                  <p>1154707982</p>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <MapPin className="h-8 w-8" />
                  <p className="font-semibold">Dirección</p>
                  <p>Avenida Libertador 5990, oficina 505</p>
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