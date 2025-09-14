const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const dataService = require('../services/dataService'); // <-- Importar dataService

// Aplicar autenticación a todas las rutas
router.use(verifyToken);



// CRUD principal de carritos
router.get('/', cartController.getAllCarts.bind(cartController)); // paginado
router.post('/', cartController.createCart.bind(cartController)); // crear
router.put('/:id', cartController.updateCart.bind(cartController)); // actualizar productos
router.delete('/:id', cartController.deleteCart.bind(cartController)); // eliminar carrito

// Obtener carrito por user_id como query param (?user_id=...)
router.get('/cart', cartController.getCartByUserQuery.bind(cartController));

module.exports = router;