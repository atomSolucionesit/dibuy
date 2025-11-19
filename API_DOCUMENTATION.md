# API Documentation - Dibuy Frontend

Este documento describe cómo debe responder la API para que el frontend funcione correctamente.

## 📋 Estructura General de Respuestas

Todas las respuestas de la API deben seguir este formato:

```json
{
  "status": 200,
  "message": "Success message",
  "info": {
    "data": [...], // Array de datos o objeto único
    "meta": {      // Solo para respuestas paginadas
      "total": 100,
      "page": 1,
      "pages": 5,
      "size": 20
    }
  }
}
```

## 🛍️ Endpoints de Productos

### 1. Obtener Todos los Productos
**Endpoint:** `GET /products`
**Parámetros de consulta:**
- `page` (number): Número de página (default: 1)
- `limit` (number): Elementos por página (default: 20)

**Respuesta esperada:**
```json
{
  "status": 200,
  "message": "",
  "info": {
    "data": [
      {
        "id": "prod_123",
        "name": "iPhone 15 Pro",
        "description": "Descripción del producto",
        "price": 1200000,
        "sellingPrice": 1200000,
        "originalPrice": 1300000,
        "images": [
          {
            "id": "img_1",
            "url": "https://example.com/image1.jpg",
            "productId": "prod_123",
            "createdAt": "2024-01-01T00:00:00Z"
          }
        ],
        "category": "smartphones",
        "brandId": 1,
        "stock": 50,
        "rating": 4.5,
        "reviews": 120,
        "specifications": {
          "color": "Negro",
          "storage": "256GB",
          "ram": "8GB"
        },
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z",
        "badge": "Nuevo",
        "outstandingDescription": "El mejor smartphone del año",
        "CategoryProduct": [
          {
            "categoryId": "cat_1"
          }
        ]
      }
    ],
    "meta": {
      "total": 100,
      "page": 1,
      "pages": 5,
      "size": 20
    }
  }
}
```

### 2. Obtener Producto por ID
**Endpoint:** `GET /products/{id}`

**Respuesta esperada:**
```json
{
  "status": 200,
  "message": "",
  "info": {
    "data": {
      "id": "prod_123",
      "name": "iPhone 15 Pro",
      // ... mismo formato que arriba
    }
  }
}
```

### 3. Productos Destacados
**Endpoint:** `GET /products/outstanding`
**Parámetros de consulta:**
- `limit` (number): Número de productos (default: 4)

**Respuesta esperada:**
```json
{
  "status": 200,
  "message": "",
  "info": {
    "data": [
      // Array de productos con el mismo formato
    ]
  }
}
```

### 4. Buscar Productos
**Endpoint:** `GET /products/search`
**Parámetros de consulta:**
- `q` (string): Término de búsqueda

**Respuesta esperada:**
```json
{
  "status": 200,
  "message": "",
  "info": {
    "data": [
      // Array de productos que coinciden con la búsqueda
    ]
  }
}
```

### 5. Productos por Categoría
**Endpoint:** `GET /categories/{categoryId}/products`
**Parámetros de consulta:**
- `page` (number): Número de página (default: 1)
- `limit` (number): Elementos por página (default: 20)

**Respuesta esperada:**
```json
{
  "status": 200,
  "message": "",
  "info": {
    "data": [
      // Array de productos de la categoría específica
    ],
    "meta": {
      "total": 25,
      "page": 1,
      "pages": 2,
      "size": 20
    }
  }
}
```

## 📂 Endpoints de Categorías

### 1. Obtener Todas las Categorías
**Endpoint:** `GET /category`

**Respuesta esperada:**
```json
{
  "status": 200,
  "message": "",
  "info": {
    "data": [
      {
        "id": "cat_1",
        "name": "Smartphones",
        "slug": "smartphones",
        "description": "Teléfonos inteligentes",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      },
      {
        "id": "cat_2",
        "name": "Laptops",
        "slug": "laptops",
        "description": "Computadoras portátiles",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

## 🔐 Autenticación

### 1. Login de E-commerce
**Endpoint:** `POST /auth/ecommerce/login`
**Body:**
```json
{
  "companyToken": "your-company-token"
}
```

**Respuesta esperada:**
```json
{
  "status": 200,
  "message": "Login successful",
  "info": {
    "data": {
      "token": "jwt-token-here",
      "user": {
        "id": "user_123",
        "email": "company@example.com",
        "firstName": "Company",
        "lastName": "User",
        "role": "admin"
      }
    }
  }
}
```

## 🚨 Manejo de Errores

### Respuesta de Error
```json
{
  "status": 400,
  "message": "Error message",
  "info": {
    "data": null
  }
}
```

### Códigos de Estado Esperados
- `200`: Éxito
- `400`: Error de solicitud
- `401`: No autorizado
- `404`: No encontrado
- `500`: Error del servidor

## 🔧 Configuración del Frontend

### Variables de Entorno Requeridas
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_COMPANY_TOKEN=your-company-token-here
```

### Headers de Autenticación
El frontend enviará automáticamente el token JWT en el header:
```
Authorization: Bearer {jwt-token}
```

## 📝 Notas Importantes

1. **Formato de Imágenes**: Las URLs de imágenes deben ser accesibles públicamente
2. **Precios**: Todos los precios están en pesos argentinos (ARS)
3. **IDs**: Usar strings para todos los IDs de productos y categorías
4. **Paginación**: Siempre incluir meta información para endpoints paginados
5. **CategoryProduct**: Es un array que relaciona productos con categorías
6. **Stock**: Número entero que representa unidades disponibles
7. **Rating**: Número decimal entre 0 y 5
8. **Fechas**: Formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)

## 🔄 Flujo de Datos

1. **Inicio de la aplicación**: Auto-login con company token
2. **Carga de productos**: GET /products con paginación
3. **Carga de categorías**: GET /category
4. **Filtrado por categoría**: GET /categories/{id}/products
5. **Búsqueda**: GET /products/search?q={query}
6. **Productos destacados**: GET /products/outstanding

## 🧪 Datos de Prueba

Para testing, asegúrate de que la API devuelva al menos:
- 20+ productos con diferentes categorías
- 5+ categorías diferentes
- Productos con múltiples imágenes
- Productos con stock > 0
- Productos con ratings variados (1-5)