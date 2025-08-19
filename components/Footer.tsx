import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

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
            <Image src="/logo.png" alt="DIBUY" width={120} height={40} className="h-10 w-auto" />
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
                <Link href="/marcas" className="text-gray-300 hover:text-magenta transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-magenta rounded-full"></span>
                  <span>Marcas</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-magenta transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-magenta rounded-full"></span>
                  <span>Blog</span>
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
                <Link href="/ayuda" className="text-gray-300 hover:text-zafiro transition-colors flex items-center space-x-2">
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
                  <span>Devoluciones</span>
                </Link>
              </li>
              <li>
                <Link href="/garantia" className="text-gray-300 hover:text-zafiro transition-colors flex items-center space-x-2">
                  <span className="w-1 h-1 bg-zafiro rounded-full"></span>
                  <span>Garantía</span>
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-zafiro transition-colors flex items-center space-x-2">
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
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-magenta/20 rounded-full">
                  <Phone className="h-4 w-4 text-magenta" />
                </div>
                <span className="text-gray-300">+54 11 1234-5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-zafiro/20 rounded-full">
                  <Mail className="h-4 w-4 text-zafiro" />
                </div>
                <span className="text-gray-300">info@dibuy.com</span>
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

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 DIBUY. Todos los derechos reservados.</p>
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
