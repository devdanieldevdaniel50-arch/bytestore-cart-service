# Servicio de Carritos - ByteStore

## ¿Qué hace este servicio?

- Permite que cada usuario tenga **solo un carrito**. Si no existe, se crea automáticamente al consultar o agregar productos.
- Los productos se agregan dinámicamente al carrito:
  - Si el producto no existe en el sistema, se registra automáticamente.
  - Si otro usuario tiene el mismo producto, no se duplica el registro.
- Todas las operaciones requieren autenticación JWT. El servicio valida que el usuario del token coincida con el usuario que realiza la operación.
- Si el carrito queda vacío, el usuario puede eliminarlo manualmente o se elimina al cerrar sesión (esto lo gestiona el cliente).

## Instalación rápida

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Configura el archivo `.env` (opcional):
   ```bash
   PORT=8000
   JWT_SECRET=@y*&0a%K%7P0t@uQ^38HN$y4Z^PK#0zE7dem700Bbf&pC6HF$aU^ARkE@u$nn
   CORS_ORIGIN=http://localhost:3000
   ```
3. Inicia el servidor:
   ```bash
   npm start
   # o en desarrollo
   npm run dev
   ```

## Cómo usar la API

Todas las rutas requieren un JWT válido. Puedes enviarlo en el header `Authorization: Bearer <token>`, en el header `x-auth-token`, como query param `?token=...` o en el body.

### Endpoints principales

- **GET /carts**: Obtiene el carrito del usuario autenticado. Si no existe, se crea automáticamente.
- **POST /carts**: Crea un carrito para el usuario (solo si no existe).
- **PUT /carts/:id**: Actualiza el carrito (productos, cantidades, etc).
- **DELETE /carts/:id**: Elimina el carrito (solo si está vacío o el usuario lo solicita).
- **POST /carts/:id/products**: Agrega un producto al carrito. Si el producto no existe, se registra.
- **PUT /carts/:id/products/:productId**: Actualiza la cantidad de un producto en el carrito.
- **DELETE /carts/:id/products/:productId**: Elimina un producto del carrito.
- **DELETE /carts/:id/clear**: Vacía el carrito por completo.

### Ejemplo de respuesta paginada

```json
{
  "first": 1,
  "prev": null,
  "next": 2,
  "last": 5,
  "pages": 5,
  "items": 50,
  "data": [ ...carritos... ]
}
```

### Códigos de respuesta

- 200 OK: Operación exitosa
- 201 Created: Recurso creado
- 204 No Content: Sin contenido
- 400 Bad Request: Datos inválidos
- 401 Unauthorized: Token requerido o inválido
- 403 Forbidden: Permisos insuficientes
- 404 Not Found: Recurso no encontrado
- 409 Conflict: Conflicto (ejemplo: carrito ya existe)
- 500 Internal Server Error: Error inesperado

## Reglas de negocio

- Solo un carrito por usuario. Si no existe, se crea automáticamente.
- Los productos se almacenan dinámicamente:
- Si un producto no existe, se registra.
- Si otro usuario tiene el mismo producto, no se vuelve a registrar.
- Todas las peticiones deben validar el JWT (el id del body debe coincidir con el del token).

## Consejos y notas

- Usa siempre el JWT para todas las operaciones. El secreto es: `@y*&0a%K%7P0t@uQ^38HN$y4Z^PK#0zE7dem700Bbf&pC6HF$aU^ARkE@u$nn` y la duración es de 30 días.
- No necesitas aplicar todos los principios REST, solo asegúrate de que las operaciones CRUD funcionen correctamente y uses los códigos HTTP básicos.
- El servicio está listo para montarse en Docker y es compatible con el cliente ByteStore.

## Pruebas automáticas y generación de tokens

Para ejecutar las pruebas del API y generar tokens válidos, sigue estos pasos:

1. **Genera los tokens:**
   
   Ejecuta el generador de tokens con:
   ```bash
   node generate-tokens.js
   ```
   Esto imprimirá en consola dos tokens: uno de admin y uno de usuario.

2. **Copia los tokens generados:**
   
   Copia los valores de los tokens que aparecen en la consola.

3. **Actualiza los tokens en el archivo de pruebas:**
   
   Abre `src/test-api.js` y reemplaza las líneas donde se definen `adminToken` y `userToken` por los nuevos tokens generados. Ejemplo:
   ```js
   const adminToken = 'Bearer TU_NUEVO_TOKEN_ADMIN';
   const userToken = 'Bearer TU_NUEVO_TOKEN_USER';
   ```

4. **Ejecuta las pruebas:**
   
   Ejecuta:
   ```bash
   node src/test-api.js
   ```
   Verás en consola los resultados de las pruebas del API.

> Si ves errores de token inválido, asegúrate de haber copiado los tokens correctamente y que no estén expirados.

¡Listo! Así puedes probar el API de carritos de manera sencilla y rápida.

---

¡Listo! Ahora puedes gestionar carritos de compra de manera segura y sencilla. Si tienes alguna pregunta, revisa el código o contacta al desarrollador.
