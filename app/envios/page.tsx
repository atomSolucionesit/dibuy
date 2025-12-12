import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Truck, Package, Star } from "lucide-react";

export default function EnviosPage() {
  const shippingMethods = [
    {
      id: 1,
      name: "Correo Argentino",
      description: "Centro principal de envíos que utiliza la empresa",
      icon: <Star className="h-8 w-8" />,
      color: "from-magenta to-zafiro",
      features: ["Cobertura nacional", "Seguimiento online", "Entrega a domicilio"]
    },
    {
      id: 2,
      name: "Andreani",
      description: "Envíos rápidos y seguros en todo el país",
      icon: <Truck className="h-8 w-8" />,
      color: "from-blue-500 to-blue-600",
      features: ["Entrega rápida", "Red de sucursales", "Seguimiento en tiempo real"]
    },
    {
      id: 3,
      name: "OCA",
      description: "Servicio de mensajería confiable",
      icon: <Package className="h-8 w-8" />,
      color: "from-green-500 to-green-600",
      features: ["Amplia cobertura", "Flexibilidad horaria", "Retiro en sucursal"]
    },
    {
      id: 4,
      name: "MercadoEnvíos",
      description: "Integración completa con MercadoLibre",
      icon: <Truck className="h-8 w-8" />,
      color: "from-yellow-500 to-orange-500",
      features: ["Envío gratuito", "Protección al comprador", "Entrega garantizada"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blanco to-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-magenta to-zafiro rounded-full mb-6">
              <Truck className="h-8 w-8 text-blanco" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-negro mb-4">
              Métodos de Envío
            </h1>
            <p className="text-lg text-gray-600">
              Elige el método de envío que mejor se adapte a tus necesidades
            </p>
          </div>

          {/* Shipping Methods Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {shippingMethods.map((method) => (
              <div
                key={method.id}
                className="bg-blanco rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${method.color} rounded-full mb-4 text-blanco`}>
                    {method.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-negro mb-2">
                    {method.name}
                  </h2>
                  {method.id === 1 && (
                    <span className="inline-block bg-gradient-to-r from-oro to-magenta text-negro px-3 py-1 rounded-full text-sm font-semibold mb-3">
                      ⭐ Principal
                    </span>
                  )}
                  <p className="text-gray-600">
                    {method.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {method.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-magenta rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-blanco rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-negro mb-6 text-center">Información General</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <h4 className="font-semibold text-negro mb-2">Envío Gratuito</h4>
                <p className="text-gray-600">En compras superiores a $50.000</p>
              </div>
              <div>
                <h4 className="font-semibold text-negro mb-2">Tiempo de Entrega</h4>
                <p className="text-gray-600">3 a 7 días hábiles</p>
              </div>
              <div>
                <h4 className="font-semibold text-negro mb-2">Seguimiento</h4>
                <p className="text-gray-600">Código de tracking incluido</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}