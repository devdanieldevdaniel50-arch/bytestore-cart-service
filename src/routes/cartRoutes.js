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

// Obtener carrito por id
router.get('/id/:id', cartController.getCartById.bind(cartController));

// Obtener carrito por user_id
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const cart = await dataService.getCartByUserId(user_id);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado para este usuario' });
    // Validar permisos: solo el dueño o admin puede ver
    if (req.user.role !== 'ADMINISTRADOR' && cart.user_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para ver este carrito' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
});

module.exports = router;