"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, FileText } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-negro text-blanco relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-magenta/5 via-transparent to-zafiro/5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-oro/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Image src="/logo-footer.png" alt="DIBUY" width={250} height={250} className="w-full h-10" style={{ width: 'auto', height: '50px' }} />
            <p className="text-gray-300">
              Tu tienda de tecnología de confianza. Productos de calidad con la mejor atención al cliente.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-magenta transition-colors p-2 bg-gray-800 rounded-full hover:bg-magenta/20">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-magenta transition-colors p-2 bg-gray-800 rounded-full hover:bg-magenta/20">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-zafiro transition-colors p-2 bg-gray-800 rounded-full hover:bg-zafiro/20">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-oro transition-colors p-2 bg-gray-800 rounded-full hover:bg-oro/20">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-blanco">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/productos" className="text-gray-300 hover:text-magenta transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-magenta rounded-full"></span>
                  <span>Productos</span>
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-gray-300 hover:text-magenta transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-magenta rounded-full"></span>
                  <span>Ofertas</span>
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-gray-300 hover:text-magenta transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-magenta rounded-full"></span>
                  <span>Nosotros</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-blanco">Atención al cliente</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/centro-de-ayuda" className="text-gray-300 hover:text-zafiro transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-zafiro rounded-full"></span>
                  <span>Centro de ayuda</span>
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-gray-300 hover:text-zafiro transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-zafiro rounded-full"></span>
                  <span>Envíos</span>
                </Link>
              </li>
              <li>
                <Link href="/devoluciones" className="text-gray-300 hover:text-zafiro transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-zafiro rounded-full"></span>
                  <span>Cambios y Devoluciones</span>
                </Link>
              </li>
              <li>
                <Link href="/garantias" className="text-gray-300 hover:text-zafiro transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-zafiro rounded-full"></span>
                  <span>Garantía</span>
                </Link>
              </li>
              <li>
                <Link href="/centro-de-ayuda" className="text-gray-300 hover:text-zafiro transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-zafiro rounded-full"></span>
                  <span>Contacto</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-blanco">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigator.clipboard.writeText('+54 9 11 5470-7982')}>
                <div className="p-2 bg-magenta/20 rounded-full">
                  <Phone className="h-4 w-4 text-magenta" />
                </div>
                <span className="text-gray-300 hover:text-magenta transition-colors">+54 9 11 5470-7982</span>
              </div>
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigator.clipboard.writeText('administracion@comex-consultores.com.ar')}>
                <div className="p-2 bg-zafiro/20 rounded-full">
                  <Mail className="h-4 w-4 text-zafiro" />
                </div>
                <span className="text-gray-300 hover:text-zafiro transition-colors">administracion@comex-consultores.com.ar</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-oro/20 rounded-full">
                  <MapPin className="h-4 w-4 text-oro" />
                </div>
                <span className="text-gray-300">Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 gap-4 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2026 DIBUY. Todos los derechos reservados.</p>
          <div className="flex items-center">
            <a href="http://qr.afip.gob.ar/?qr=Z_K3-UrHdyNpbWmJYrohJw,," target="_F960AFIPInfo" className="mx-4">
              <img src="http://www.afip.gob.ar/images/f960/DATAWEB.jpg" alt="AFIP" className="w-10 h-auto lg:w-24" />
            </a>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacidad" className="text-gray-400 hover:text-magenta text-sm transition-colors">
              Política de privacidad
            </Link>
            <Link href="/terminos" className="text-gray-400 hover:text-magenta text-sm transition-colors">
              Términos y condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
