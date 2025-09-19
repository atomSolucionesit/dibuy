# Dibuy E-commerce

Una aplicación de e-commerce moderna construida con Next.js, TypeScript y Tailwind CSS.

## 🚀 Características

- **Frontend Moderno**: Next.js 15 con App Router
- **TypeScript**: Tipado estático completo
- **UI/UX**: Tailwind CSS con componentes shadcn/ui
- **Estado Global**: React Query para manejo de estado del servidor
- **Autenticación**: Sistema completo de auth con JWT
- **Carrito de Compras**: Gestión completa del carrito
- **Responsive**: Diseño adaptativo para todos los dispositivos
- **SEO Optimizado**: Meta tags y estructura semántica

## 📁 Estructura del Proyecto

```
dibuy-ecommerce/
├── app/                    # App Router de Next.js
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Rutas del dashboard
│   ├── api/               # API Routes
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── forms/            # Componentes de formularios
│   └── layout/           # Componentes de layout
├── hooks/                # Hooks personalizados
│   ├── useAuth.ts        # Hook de autenticación
│   ├── useProducts.ts    # Hook de productos
│   └── useCart.ts        # Hook del carrito
├── lib/                  # Utilidades y configuración
│   ├── api.ts            # Cliente HTTP (axios)
│   ├── utils.ts          # Utilidades generales
│   ├── constants.ts      # Constantes globales
│   └── utils/
│       └── api.ts        # Utilidades para API
├── providers/            # Providers de contexto
│   ├── QueryProvider.tsx # React Query Provider
│   └── AuthProvider.tsx  # Auth Provider
├── services/             # Servicios de API
│   ├── authService.ts    # Servicio de autenticación
│   ├── productService.ts # Servicio de productos
│   └── cartService.ts    # Servicio del carrito
├── types/                # Tipos TypeScript
│   └── api.ts            # Tipos de la API
├── contexts/             # Contextos de React
├── data/                 # Datos estáticos
├── public/               # Archivos públicos
└── styles/               # Estilos adicionales
```

## 🛠️ Tecnologías

### Frontend
- **Next.js 15**: Framework de React con App Router
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de CSS utility-first
- **shadcn/ui**: Componentes de UI modernos
- **React Query**: Manejo de estado del servidor
- **Axios**: Cliente HTTP

### Herramientas de Desarrollo
- **ESLint**: Linting de código
- **Prettier**: Formateo de código
- **TypeScript**: Compilador de tipos

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd dibuy-ecommerce
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 📚 Uso de la API

### Configuración Base

El proyecto está configurado para hacer peticiones a un backend. La configuración base se encuentra en:

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
```

### Servicios Disponibles

#### AuthService
```typescript
import { AuthService } from '@/services/authService';

// Login
const authResponse = await AuthService.login({ email, password });

// Registro
const authResponse = await AuthService.register(userData);

// Logout
await AuthService.logout();

// Obtener usuario actual
const user = await AuthService.getCurrentUser();
```

#### ProductService
```typescript
import { ProductService } from '@/services/productService';

// Obtener productos
const products = await ProductService.getProducts(page, limit, filters);

// Obtener producto por ID
const product = await ProductService.getProductById(id);

// Buscar productos
const searchResults = await ProductService.searchProducts(query);
```

#### CartService
```typescript
import { CartService } from '@/services/cartService';

// Obtener carrito
const cart = await CartService.getCart();

// Agregar al carrito
const updatedCart = await CartService.addToCart(productId, quantity);

// Actualizar cantidad
const updatedCart = await CartService.updateCartItem(itemId, quantity);
```

### Hooks Personalizados

#### useAuth
```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, isLoading, isAuthenticated, login, logout } = useAuth();
```

#### useProducts
```typescript
import { useProducts, useProduct } from '@/hooks/useProducts';

// Obtener lista de productos
const { data: products, isLoading, error } = useProducts(page, limit, filters);

// Obtener producto específico
const { data: product, isLoading } = useProduct(productId);
```

#### useCart
```typescript
import { useCart, useAddToCart } from '@/hooks/useCart';

// Obtener carrito
const { data: cart, isLoading } = useCart();

// Agregar al carrito
const addToCart = useAddToCart();
addToCart.mutate({ productId, quantity });
```

## 🎨 Componentes UI

El proyecto utiliza shadcn/ui para los componentes base. Todos los componentes están en `components/ui/`.

### Uso de Componentes
```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mi Componente</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Escribe algo..." />
        <Button>Enviar</Button>
      </CardContent>
    </Card>
  );
}
```

## 🔧 Configuración

### Variables de Entorno

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Autenticación
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Base de datos (si aplica)
DATABASE_URL=your-database-url

# Servicios externos
STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### Configuración de Tailwind

El archivo `tailwind.config.ts` incluye:
- Configuración de colores personalizados
- Fuentes personalizadas
- Animaciones
- Plugins adicionales

## 📱 Responsive Design

El proyecto está optimizado para:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Breakpoints
```css
/* Mobile First */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large Desktop */ }
```

## 🔒 Autenticación

### Flujo de Autenticación

1. **Login/Registro**: Usuario ingresa credenciales
2. **JWT Token**: Se recibe y almacena en localStorage
3. **Interceptores**: Axios automáticamente incluye el token
4. **Refresh**: Token se renueva automáticamente
5. **Logout**: Se limpian todos los tokens

### Protección de Rutas

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

## 🛒 Carrito de Compras

### Funcionalidades

- ✅ Agregar/remover productos
- ✅ Actualizar cantidades
- ✅ Aplicar cupones
- ✅ Calcular envío
- ✅ Guardar para más tarde
- ✅ Verificar disponibilidad

### Estado del Carrito

```typescript
interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}
```

## 🔍 Búsqueda y Filtros

### Búsqueda de Productos

```typescript
// Búsqueda por texto
const results = await ProductService.searchProducts(query);

// Filtros disponibles
interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  search?: string;
}
```

## 📊 Manejo de Estado

### React Query

El proyecto utiliza React Query para:
- **Caching**: Almacenamiento inteligente de datos
- **Sincronización**: Actualización automática
- **Optimistic Updates**: Actualizaciones optimistas
- **Error Handling**: Manejo centralizado de errores

### Configuración

```typescript
// providers/QueryProvider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000,   // 10 minutos
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

## 🎯 SEO

### Meta Tags

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: "Dibuy - Tu tienda de tecnología",
  description: "Encuentra los mejores productos tecnológicos",
  keywords: ["tecnología", "smartphones", "laptops"],
};
```

### Structured Data

```typescript
// Componentes con datos estructurados
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "price": product.price,
    }),
  }}
/>
```

## 🧪 Testing

### Configuración de Tests

```bash
# Instalar dependencias de testing
npm install --save-dev @testing-library/react @testing-library/jest-dom jest

# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch
```

## 🚀 Deployment

### Vercel (Recomendado)

1. **Conectar repositorio** en Vercel
2. **Configurar variables de entorno**
3. **Deploy automático** en cada push

### Otros Proveedores

- **Netlify**: Configurar build command `npm run build`
- **Railway**: Deploy directo desde GitHub
- **Docker**: Dockerfile incluido

## 📈 Performance

### Optimizaciones

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Lazy loading automático
- **Bundle Analysis**: `@next/bundle-analyzer`
- **Caching**: React Query + HTTP caching

### Métricas

- **Lighthouse Score**: >90 en todas las categorías
- **Core Web Vitals**: Optimizados
- **Bundle Size**: <500KB inicial

## 🤝 Contribución

1. **Fork** el proyecto
2. **Crear** una rama feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** los cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abrir** un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes alguna pregunta o necesitas ayuda:

- 📧 Email: soporte@dibuy.com
- 💬 Discord: [Servidor de la comunidad]
- 📖 Documentación: [Link a la documentación]

---

**¡Gracias por usar Dibuy E-commerce! 🚀**
