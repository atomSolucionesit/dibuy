import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, Mail } from "lucide-react";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blanco to-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-zafiro to-magenta rounded-full mb-6 text-blanco">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-negro mb-4">
              Política de Privacidad
            </h1>
            <p className="text-lg text-gray-600">
              Última actualización: 29/12/2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-blanco rounded-2xl shadow-lg p-8 md:p-12 prose prose-gray max-w-none">
            <div className="space-y-8 text-gray-700">
              <p className="text-lg leading-relaxed">
                En <strong>DIBUY</strong> (administrada por DiBuy Com / Comex Consultores), nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política describe cómo recolectamos, usamos y protegemos su información personal conforme a las normativas vigentes en la República Argentina.
              </p>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-6 w-6 text-zafiro" />
                  <h2 className="text-2xl font-bold text-negro m-0">1. Información Recolectada</h2>
                </div>
                <p>
                  Recolectamos los datos personales necesarios para brindar un servicio eficiente y personalizado. Esto incluye:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Datos de identificación: Nombre y apellido.</li>
                  <li>Datos de contacto: Correo electrónico, número de teléfono y dirección de entrega.</li>
                  <li>Datos de navegación: Información técnica sobre su dispositivo y uso de la plataforma para mejorar la experiencia de usuario.</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-6 w-6 text-magenta" />
                  <h2 className="text-2xl font-bold text-negro m-0">2. Uso de los Datos</h2>
                </div>
                <p>Los datos recolectados se utilizan exclusivamente para:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Procesar, gestionar y enviar sus órdenes de compra.</li>
                  <li>Brindar soporte técnico y atención al cliente.</li>
                  <li>Enviar comunicaciones relacionadas con el estado de su pedido o cambios en el servicio.</li>
                  <li>Enviar novedades, promociones y ofertas, siempre y cuando usted haya otorgado su consentimiento expreso.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-negro mb-4">3. Seguridad y Pagos</h2>
                <p>
                  Implementamos rigurosas medidas de seguridad técnica y organizativa para proteger su información contra pérdida, robo o acceso no autorizado.
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 my-4">
                  <p className="font-semibold text-zafiro mb-2">Seguridad Transaccional</p>
                  <p className="text-sm text-gray-700 m-0">
                    Es importante destacar que <strong>DIBUY no almacena datos de tarjetas de crédito ni medios de pago</strong>. Todas las transacciones son gestionadas de forma segura y encriptada a través de proveedores autorizados como Payway.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-negro mb-4">4. Derechos del Usuario (Ley N° 25.326)</h2>
                <p>
                  De acuerdo con la Ley de Protección de Datos Personales, usted tiene el derecho de acceso, rectificación, actualización y supresión de sus datos personales. Puede ejercer estos derechos en cualquier momento enviando una solicitud a nuestros canales de contacto.
                </p>
              </section>

              <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-6 w-6 text-negro" />
                  <h2 className="text-2xl font-bold text-negro m-0">5. Contacto</h2>
                </div>
                <p>
                  Para cualquier consulta, solicitud de rectificación o supresión de datos, puede comunicarse con nosotros:
                </p>
                <div className="mt-4 space-y-2">
                  <p>📧 Email: <strong>administracion@comex-consultores.com.ar</strong></p>
                  <p>📞 Teléfono: <strong>11-5470-7982</strong></p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
