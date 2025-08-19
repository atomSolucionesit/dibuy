import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    name: "Smartphones",
    image: "/placeholder.svg?height=200&width=200",
    href: "/categoria/smartphones",
    count: "150+ productos",
    icon: "📱",
    color: "magenta"
  },
  {
    name: "Laptops",
    image: "/placeholder.svg?height=200&width=200",
    href: "/categoria/laptops",
    count: "80+ productos",
    icon: "💻",
    color: "zafiro"
  },
  {
    name: "Tablets",
    image: "/placeholder.svg?height=200&width=200",
    href: "/categoria/tablets",
    count: "45+ productos",
    icon: "📱",
    color: "amatista"
  },
  {
    name: "Accesorios",
    image: "/placeholder.svg?height=200&width=200",
    href: "/categoria/accesorios",
    count: "200+ productos",
    icon: "🎧",
    color: "oro"
  },
  {
    name: "Gaming",
    image: "/placeholder.svg?height=200&width=200",
    href: "/categoria/gaming",
    count: "120+ productos",
    icon: "🎮",
    color: "magenta"
  },
  {
    name: "Audio",
    image: "/placeholder.svg?height=200&width=200",
    href: "/categoria/audio",
    count: "90+ productos",
    icon: "🔊",
    color: "zafiro"
  },
]

export default function Categories() {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'magenta':
        return 'hover:border-magenta hover:bg-magenta/5 group-hover:text-magenta'
      case 'zafiro':
        return 'hover:border-zafiro hover:bg-zafiro/5 group-hover:text-zafiro'
      case 'amatista':
        return 'hover:border-amatista hover:bg-amatista/5 group-hover:text-amatista'
      case 'oro':
        return 'hover:border-oro hover:bg-oro/5 group-hover:text-oro'
      default:
        return 'hover:border-magenta hover:bg-magenta/5 group-hover:text-magenta'
    }
  }

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blanco to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="badge-zafiro mb-4 inline-block">🏷️ Categorías</span>
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-negro">
            Explora por categorías
          </h2>
          <p className="text-gray-600 text-lg">Encuentra exactamente lo que buscas en nuestra amplia selección</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={`group bg-blanco rounded-xl p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-transparent ${getColorClasses(category.color)}`}
            >
              <div className="mb-4 relative">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-2xl md:text-3xl">
                  {category.icon}
                </div>
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${
                  category.color === 'magenta' ? 'bg-magenta' :
                  category.color === 'zafiro' ? 'bg-zafiro' :
                  category.color === 'amatista' ? 'bg-amatista' :
                  'bg-oro'
                } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
              <h3 className="font-semibold text-sm md:text-base mb-1 transition-colors text-negro">
                {category.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-600">{category.count}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
