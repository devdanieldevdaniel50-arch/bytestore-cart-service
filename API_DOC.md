PS C:\Users\danie\bytestore-cart-service> npm run dev

> bytestore-cart-service@1.0.0 dev
> nodemon src/server.js

[nodemon] 3.1.10
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node src/server.js`
Servidor escuchando en el puerto 8000 Documentación de la API de Carritos

## Endpoints principales

### 1. Obtener carritos paginados
- **GET /**
- **Query params:**
  - `_page` (opcional, int, default: 1): página a consultar
  - `_per_page` (opcional, int, default: 10): cantidad de carritos por página
- **Respuesta:**
```
{
  "total": 51,
  "pages": 3,
  "first": 1,
  "next": 2,
  "prev": null,
  "data": [
    {
      "user_id": "01a2b3c4-...",
      "products": [
        {
          "id": 1,
          "name": "HP Intel Core I3 - 8GB",
          "model": "15-600261a",
          "price": 3299000,
          "discount": 5,
          "stock": 20,
          "image": "http://...",
          "brand": "HP",
          "quantity": 1
        }
      ]
    }
  ]
}
```

### 2. Crear carrito
- **POST /**
- **Body:**
```
{
  "user_id": "01a2b3c4-...",
  "products": [
    {
      "id": 1,
      "name": "HP Intel Core I3 - 8GB",
      "model": "15-600261a",
      "price": 3299000,
      "discount": 5,
      "stock": 20,
      "image": "http://...",
      "brand": "HP",
      "quantity": 1
    }
  ]
}
```
- **Respuesta exitosa:** 201 + carrito creado
- **Errores:**
  - 400: datos inválidos (ver detalles en `details`)
  - 409: ya existe un carrito para ese usuario

### 2.1 Obtener carrito por user_id (nuevo formato)
- **GET /cart?user_id=...**
- Devuelve el carrito por user_id si el usuario autenticado tiene permisos.

Ejemplo:
```http
GET /cart?user_id=01a2b3c4-...
Authorization: Bearer <token>
```

Respuesta:
```json
{
  "id": "...",
  "user_id": "01a2b3c4-...",
  "products": [
    {
      "id": 1,
      "name": "HP Intel Core I3 - 8GB",
      "model": "15-600261a",
      "price": 3299000,
      "discount": 5,
      "stock": 20,
      "image": "http://...",
      "brand": "HP",
      "quantity": 1
    }
  ],
  "createdAt": "2025-09-13T05:14:56.890Z",
  "updatedAt": "2025-09-13T05:14:56.890Z"
}
```

### 3. Actualizar productos del carrito
- **PUT /:id**
- **Body:**
```
{
  "products": [
    { "id": 1, "quantity": 3 },
    { "id": 2, "quantity": 1 }
  ]
}
```
- **Respuesta exitosa:** carrito actualizado
- **Errores:**
  - 400: datos inválidos
  - 404: carrito no encontrado
  - 403: sin permiso

### 4. Eliminar carrito
- **DELETE /:id**
- **Respuesta exitosa:** 204 (sin contenido)
- **Errores:**
  - 404: carrito no encontrado
  - 403: sin permiso

---

## Cómo probar la API

1. **Inicia el servidor:**
   - `npm install`
   - `npm run dev`

2. **Prueba con Postman, Thunder Client o curl:**
   - Agrega el header `Authorization: Bearer <token>`
   - Usa los endpoints y estructuras de body indicadas arriba.

3. **Ejemplo curl:**
```
curl -X POST http://localhost:5000/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"user_id":"01a2b3c4-...","products":[{"id":1,"name":"HP Intel Core I3 - 8GB","model":"15-600261a","price":3299000,"discount":5,"stock":20,"image":"http://...","brand":"HP","quantity":1}]}'
```

> Si tienes dudas sobre los errores de validación, revisa el campo `details` en la respuesta 400.
