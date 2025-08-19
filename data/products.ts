import type { Product } from "@/contexts/CartContext"

export const products: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 1299999,
    originalPrice: 1499999,
    image: "/placeholder.svg?height=400&width=400&text=iPhone+15+Pro+Max",
    category: "smartphones",
    brand: "Apple",
    rating: 4.8,
    reviews: 124,
    description:
      "El iPhone más avanzado hasta ahora con chip A17 Pro, cámara de 48MP y pantalla Super Retina XDR de 6.7 pulgadas.",
    specifications: {
      Pantalla: '6.7" Super Retina XDR',
      Procesador: "A17 Pro",
      Cámara: "48MP + 12MP + 12MP",
      Almacenamiento: "256GB",
      Batería: "Hasta 29 horas de video",
    },
    inStock: true,
    badge: "Nuevo",
  },
  {
    id: 2,
    name: "MacBook Air M3",
    price: 1899999,
    image: "/placeholder.svg?height=400&width=400&text=MacBook+Air+M3",
    category: "laptops",
    brand: "Apple",
    rating: 4.9,
    reviews: 89,
    description:
      "La laptop más delgada y liviana de Apple con el revolucionario chip M3 para un rendimiento excepcional.",
    specifications: {
      Pantalla: '13.6" Liquid Retina',
      Procesador: "Apple M3",
      RAM: "8GB",
      Almacenamiento: "256GB SSD",
      Batería: "Hasta 18 horas",
    },
    inStock: true,
    badge: "Bestseller",
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra",
    price: 1199999,
    originalPrice: 1399999,
    image: "/placeholder.svg?height=400&width=400&text=Galaxy+S24+Ultra",
    category: "smartphones",
    brand: "Samsung",
    rating: 4.7,
    reviews: 156,
    description: "El smartphone Android más potente con S Pen integrado, cámara de 200MP y pantalla Dynamic AMOLED 2X.",
    specifications: {
      Pantalla: '6.8" Dynamic AMOLED 2X',
      Procesador: "Snapdragon 8 Gen 3",
      Cámara: "200MP + 50MP + 12MP + 10MP",
      RAM: "12GB",
      Almacenamiento: "256GB",
    },
    inStock: true,
    badge: "Oferta",
  },
  {
    id: 4,
    name: "iPad Pro 12.9",
    price: 999999,
    image: "/placeholder.svg?height=400&width=400&text=iPad+Pro+12.9",
    category: "tablets",
    brand: "Apple",
    rating: 4.8,
    reviews: 92,
    description: "La tablet más avanzada con chip M2, pantalla Liquid Retina XDR y compatibilidad con Apple Pencil.",
    specifications: {
      Pantalla: '12.9" Liquid Retina XDR',
      Procesador: "Apple M2",
      RAM: "8GB",
      Almacenamiento: "128GB",
      Cámara: "12MP + 10MP",
    },
    inStock: true,
  },
  {
    id: 5,
    name: "AirPods Pro 2",
    price: 249999,
    image: "/placeholder.svg?height=400&width=400&text=AirPods+Pro+2",
    category: "accesorios",
    brand: "Apple",
    rating: 4.6,
    reviews: 203,
    description: "Auriculares inalámbricos con cancelación activa de ruido y audio espacial personalizado.",
    specifications: {
      "Cancelación de ruido": "Activa",
      Batería: "Hasta 6 horas + 24h con estuche",
      Conectividad: "Bluetooth 5.3",
      Resistencia: "IPX4",
      Chip: "H2",
    },
    inStock: true,
  },
  {
    id: 6,
    name: "PlayStation 5",
    price: 699999,
    image: "/placeholder.svg?height=400&width=400&text=PlayStation+5",
    category: "gaming",
    brand: "Sony",
    rating: 4.9,
    reviews: 445,
    description: "La consola de videojuegos más avanzada con gráficos 4K, ray tracing y SSD ultra rápido.",
    specifications: {
      Procesador: "AMD Zen 2",
      GPU: "AMD RDNA 2",
      RAM: "16GB GDDR6",
      Almacenamiento: "825GB SSD",
      Resolución: "Hasta 8K",
    },
    inStock: true,
    badge: "Popular",
  },
]

export const getProductsByCategory = (category: string) => {
  return products.filter((product) => product.category === category)
}

export const getProductById = (id: number) => {
  return products.find((product) => product.id === id)
}

export const searchProducts = (query: string) => {
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()),
  )
}
