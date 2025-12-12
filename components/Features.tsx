import { Truck, Shield, CreditCard, Headphones } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Envío Gratis",
    description: "En compras superiores a $50.000 enviamos sin costo a todo el país",
    color: "magenta",
    emoji: "🚚"
  },
  {
    icon: Shield,
    title: "Satisfacción Garantizada",
    description: "30 días para cambios y devoluciones. Tu satisfacción es nuestra prioridad",
    color: "zafiro",
    emoji: "✅"
  },
  {
    icon: CreditCard,
    title: "Pagos Seguros",
    description: "Procesamiento seguro con encriptación SSL y múltiples métodos de pago",
    color: "amatista",
    emoji: "🔒"
  },
  {
    icon: Headphones,
    title: "Atención Personalizada",
    description: "Soporte especializado por WhatsApp y email para resolver todas tus dudas",
    color: "oro",
    emoji: "👥"
  },
]

export default function Features() {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'magenta':
        return 'bg-magenta text-blanco hover:bg-magenta-dark'
      case 'zafiro':
        return 'bg-zafiro text-blanco hover:bg-zafiro-dark'
      case 'amatista':
        return 'bg-amatista text-blanco hover:bg-amatista-dark'
      case 'oro':
        return 'bg-oro text-negro hover:bg-oro-dark'
      default:
        return 'bg-magenta text-blanco hover:bg-magenta-dark'
    }
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blanco to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="badge-oro text-negro mb-4 inline-block">✨ Nuestras ventajas</span>
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-negro">
            ¿Por qué elegir DIBUY?
          </h2>
          <p className="text-gray-600 text-lg">Descubre las ventajas que nos hacen únicos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className={`inline-flex items-center justify-center w-20 h-20 ${getColorClasses(feature.color)} rounded-full mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110`}>
                <feature.icon className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <div className="text-3xl mb-2">{feature.emoji}</div>
                <h3 className="text-lg font-semibold mb-2 text-negro group-hover:text-magenta transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
