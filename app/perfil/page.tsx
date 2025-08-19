"use client"

import { useState } from "react"
import Image from "next/image"
import { User, ShoppingBag, Heart, Settings, LogOut, Edit, Save, X } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "Entregado",
    total: 1299999,
    items: [
      { name: "iPhone 15 Pro Max", quantity: 1, price: 1299999 }
    ]
  },
  {
    id: "ORD-002", 
    date: "2024-01-10",
    status: "En tránsito",
    total: 249999,
    items: [
      { name: "AirPods Pro 2", quantity: 1, price: 249999 }
    ]
  }
]

const mockFavorites = [
  {
    id: 1,
    name: "MacBook Air M3",
    price: 1899999,
    image: "/placeholder.svg?height=400&width=400&text=MacBook+Air+M3"
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra", 
    price: 1199999,
    image: "/placeholder.svg?height=400&width=400&text=Galaxy+S24+Ultra"
  }
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@email.com",
    phone: "+54 11 1234-5678",
    address: "Av. Corrientes 1234",
    city: "Buenos Aires",
    postalCode: "1043"
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const tabs = [
    { id: "profile", name: "Perfil", icon: User },
    { id: "orders", name: "Mis pedidos", icon: ShoppingBag },
    { id: "favorites", name: "Favoritos", icon: Heart },
    { id: "settings", name: "Configuración", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Mi cuenta</h1>
            <p className="text-lg opacity-90">Gestiona tu perfil y pedidos</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{profileData.firstName} {profileData.lastName}</h3>
                  <p className="text-sm text-gray-500">{profileData.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>

              <button className="w-full flex items-center space-x-3 px-4 py-3 mt-6 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="h-5 w-5" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Información personal</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-primary hover:text-primary transition-colors"
                  >
                    {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    <span>{isEditing ? "Cancelar" : "Editar"}</span>
                  </button>
                </div>

                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nombre</label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Apellido</label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Teléfono</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Dirección</label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-100"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ciudad</label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Código postal</label>
                      <input
                        type="text"
                        value={profileData.postalCode}
                        onChange={(e) => setProfileData({...profileData, postalCode: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <button
                      type="submit"
                      onClick={() => setIsEditing(false)}
                      className="group relative overflow-hidden bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <span className="relative z-10 flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Guardar cambios</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </button>
                  )}
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Mis pedidos</h2>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">Pedido {order.id}</h3>
                          <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "Entregado" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}>
                            {order.status}
                          </span>
                          <p className="text-lg font-bold mt-1">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span>{formatPrice(item.price)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Mis favoritos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockFavorites.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      <p className="text-lg font-bold text-primary mb-4">{formatPrice(product.price)}</p>
                      <button className="w-full bg-gradient-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                        Agregar al carrito
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Configuración</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Notificaciones</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="text-primary" />
                        <span>Notificaciones por email</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="text-primary" />
                        <span>Notificaciones de pedidos</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="text-primary" />
                        <span>Newsletter</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Privacidad</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" defaultChecked className="text-primary" />
                        <span>Compartir datos para mejoras</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input type="checkbox" className="text-primary" />
                        <span>Mostrar perfil público</span>
                      </label>
                    </div>
                  </div>

                  <button className="group relative overflow-hidden bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
                    <span className="relative z-10">Guardar configuración</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
} 