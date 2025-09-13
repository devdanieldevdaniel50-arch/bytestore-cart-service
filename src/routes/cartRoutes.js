const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(verifyToken);



// Obtener todos los carritos (admin) o el del usuario autenticado
router.get('/', cartController.getAllCarts.bind(cartController));

// Obtener un carrito específico por ID
router.get('/:id', cartController.getCartById.bind(cartController));

// Crear un carrito para el usuario autenticado (si no existe)
router.post('/', cartController.createCart.bind(cartController));

// Actualizar un carrito (por ID)
router.put('/:id', cartController.updateCart.bind(cartController));

// Eliminar un carrito (solo si está vacío)
router.delete('/:id', cartController.deleteCart.bind(cartController));

// Agregar un producto al carrito
router.post('/:id/products', cartController.addProductToCart.bind(cartController));

// Actualizar la cantidad de un producto en el carrito
router.put('/:id/products/:productId', cartController.updateProductInCart.bind(cartController));

// Eliminar un producto del carrito
router.delete('/:id/products/:productId', cartController.removeProductFromCart.bind(cartController));

// Vaciar el carrito por completo
router.delete('/:id/clear', cartController.clearCart.bind(cartController));

module.exports = router;