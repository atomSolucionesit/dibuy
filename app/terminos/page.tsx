import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, ShieldCheck, Scale } from "lucide-react";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blanco to-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-magenta to-zafiro rounded-full mb-6 text-blanco">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-negro mb-4">
              Términos y Condiciones de Uso
            </h1>
            <p className="text-lg text-gray-600">
              Última actualización: 29/12/2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-blanco rounded-2xl shadow-lg p-8 md:p-12 prose prose-gray max-w-none">
            <div className="space-y-8 text-gray-700">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="h-6 w-6 text-magenta" />
                  <h2 className="text-2xl font-bold text-negro m-0">1. ACEPTACIÓN DE LOS TÉRMINOS</h2>
                </div>
                <p>
                  El presente documento establece los Términos y Condiciones de Uso (en adelante, “Términos”) que regulan el acceso y uso del sitio web, aplicación o plataforma (en adelante, la “Plataforma”) administrada por DiBuy Com, con domicilio en Av. Libertador 5990, piso 5, oficina 505, CUIT 30-71058356-7 (en adelante, “la Empresa”).
                </p>
                <p>
                  Al acceder, registrarse o utilizar los servicios ofrecidos a través de la Plataforma, el usuario (en adelante, “el Usuario”) acepta plena y expresamente los presentes Términos y se compromete a cumplirlos. Si el Usuario no está de acuerdo con alguno de estos Términos, deberá abstenerse de utilizar la Plataforma.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-negro mb-4">2. DESCRIPCIÓN DEL SERVICIO</h2>
                <p>
                  La Plataforma tiene por objeto ofrecer un espacio digital para la compra, venta y/o gestión de productos y servicios.
                </p>
                <p>
                  La Empresa actúa como intermediario tecnológico, brindando herramientas de gestión comercial, catálogo, órdenes, stock y medios de pago, sin asumir responsabilidad directa sobre la comercialización, envío o calidad de los productos ofrecidos por terceros.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-negro mb-4">3. REGISTRO Y CUENTA DE USUARIO</h2>
                <p>
                  Para acceder a determinadas funciones, el Usuario deberá registrarse creando una cuenta personal con datos verídicos, actualizados y completos.
                </p>
                <p>
                  El Usuario es responsable de mantener la confidencialidad de su contraseña y del uso de su cuenta.
                </p>
                <p>
                  La Empresa podrá suspender o eliminar una cuenta si detecta uso indebido, fraude, violación de los Términos o inactividad prolongada.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-negro mb-4">4. CONDICIONES DE COMPRA Y PAGO</h2>
                <p>
                  Las transacciones se procesan mediante plataformas de pago externas y seguras, como Payway, u otras integradas al sistema.
                </p>
                <p>
                  Los datos de tarjetas y medios de pago no son almacenados en los servidores de la Empresa, sino gestionados por los proveedores autorizados.
                </p>
                <p>
                  La confirmación de una compra estará sujeta a la autorización del medio de pago y a la disponibilidad del producto o servicio adquirido.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-negro mb-4">5. POLÍTICA DE ENVÍOS Y DEVOLUCIONES</h2>
                <p>
                  Los plazos y modalidades de envío son establecidos por los vendedores o responsables logísticos.
                </p>
                <p>
                  En caso de inconformidad, fallas o errores en la entrega, el Usuario deberá comunicarse directamente con el vendedor o mediante los canales de atención dispuestos en la Plataforma.
                </p>
                <p>
                  Las devoluciones o reembolsos se regirán por la Ley de Defensa del Consumidor N° 24.240 y demás normas aplicables.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-negro mb-4">6. RESPONSABILIDAD DE LA EMPRESA</h2>
                <p>
                  La Empresa no asume responsabilidad por la veracidad, calidad o cumplimiento de los productos y servicios ofrecidos por terceros.
                </p>
                <p>
                  Tampoco se responsabiliza por interrupciones, fallas técnicas o eventos de fuerza mayor que puedan afectar la disponibilidad de la Plataforma.
                </p>
                <p>
                  No obstante, se compromete a mantener la seguridad, continuidad y transparencia en el uso del sistema.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-negro mb-4">7. PRIVACIDAD Y PROTECCIÓN DE DATOS</h2>
                <p>
                  La información personal del Usuario será tratada conforme a la Ley N° 25.326 de Protección de Datos Personales y a la Política de Privacidad publicada en la Plataforma.
                </p>
                <p>
                  El Usuario podrá ejercer sus derechos de acceso, rectificación y supresión de sus datos mediante los canales oficiales de contacto.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-negro mb-4">8. PROPIEDAD INTELECTUAL</h2>
                <p>
                  Todos los contenidos, diseños, marcas, códigos y demás elementos presentes en la Plataforma son propiedad exclusiva de la Empresa o de sus licenciantes, y están protegidos por las leyes de propiedad intelectual vigentes.
                </p>
                <p>
                  Queda prohibido su uso, reproducción o distribución sin autorización expresa y por escrito.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-negro mb-4">9. MODIFICACIONES DE LOS TÉRMINOS</h2>
                <p>
                  La Empresa podrá modificar los presentes Términos en cualquier momento, publicando la versión actualizada en la Plataforma.
                </p>
                <p>
                  El uso continuado del servicio después de la publicación de cambios implicará la aceptación de los mismos.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <Scale className="h-6 w-6 text-zafiro" />
                  <h2 className="text-2xl font-bold text-negro m-0">10. LEY APLICABLE Y JURISDICCIÓN</h2>
                </div>
                <p>
                  Estos Términos se rigen por las leyes de la República Argentina.
                </p>
                <p>
                  Cualquier controversia derivada de la interpretación o cumplimiento de los presentes Términos será sometida a los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires, con renuncia expresa a cualquier otro fuero o jurisdicción.
                </p>
              </section>

              <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-negro mb-4">11. CONTACTO</h2>
                <div className="space-y-2">
                  <p>Para consultas, reclamos o solicitudes relacionadas con estos Términos, el Usuario podrá comunicarse a:</p>
                  <p>📧 <strong>administración@comex-consultores.com.ar</strong></p>
                  <p>📞 <strong>11-5470-7982</strong></p>
                  <p>🏢 <strong>Av. Libertador 5990, piso 5, oficina 505 – Belgrano, CABA.</strong></p>
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
