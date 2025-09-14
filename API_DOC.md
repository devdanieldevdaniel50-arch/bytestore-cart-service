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

### 1. Obtener carritos paginados o por usuario
- **GET /**
- **Query params:**
  - `_page` (opcional, int, default: 1): página a consultar
  - `_per_page` (opcional, int, default: 10): cantidad de carritos por página
  - `user_id` (opcional, string): si se envía, devuelve solo el carrito de ese usuario (si tienes permisos)
- **Respuesta:**
```json
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

- **Ejemplo para obtener carrito por usuario:**
  ```
  GET /?user_id=01a2b3c4-...
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

### 2. Crear carrito
- **POST /**
- **Body:**
```json
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


### 3. Actualizar productos del carrito
- **PUT /:id**
- **Body:**

Puedes enviar los productos como array (varios o uno solo):
```json
{
  "products": [
    {
      "id": 1,
      "name": "HP Intel Core I3 - 8GB",
      "price": 3299000,
      "discount": 54,
      "stock": 20,
      "image": "http://localhost:3000/products/images/198122843657-001-750Wx750H.webp",
      "model": "15-fd0026la",
      "brand": "HP",
      "quantity": 1
    }
  ]
}
```
O como objeto (un solo producto):
```json
{
  "products": {
    "id": 1,
    "name": "HP Intel Core I3 - 8GB",
    "price": 3299000,
    "discount": 54,
    "stock": 20,
    "image": "http://localhost:3000/products/images/198122843657-001-750Wx750H.webp",
    "model": "15-fd0026la",
    "brand": "HP",
    "quantity": 1
  }
}
```

Ambos formatos son válidos. No se permiten productos con el mismo `id` en el array. Si envías productos duplicados, recibirás un error 400:
```json
{
  "error": "No se permiten productos duplicados en el carrito (id repetido)"
}
```
- **Respuesta exitosa:** carrito actualizado
- **Errores:**
  - 400: datos inválidos o productos duplicados
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

-2. **Prueba con Postman, Thunder Client o curl:**
  - Agrega el header `Authorization: Bearer <token>`
  - Usa los endpoints y estructuras de body indicadas arriba.
  - El endpoint para obtener carrito por usuario es `GET /?user_id=...` (sin /cart)

3. **Ejemplo curl:**
```
curl -X POST http://localhost:8000/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"user_id":"01a2b3c4-...","products":[{"id":1,"name":"HP Intel Core I3 - 8GB","model":"15-600261a","price":3299000,"discount":5,"stock":20,"image":"http://...","brand":"HP","quantity":1}]}'
```

> Si tienes dudas sobre los errores de validación, revisa el campo `details` en la respuesta 400.
