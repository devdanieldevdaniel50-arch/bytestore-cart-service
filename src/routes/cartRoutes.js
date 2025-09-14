const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(verifyToken);



// CRUD principal de carritos
router.get('/', cartController.getAllCarts.bind(cartController)); // paginado
router.post('/', cartController.createCart.bind(cartController)); // crear
router.put('/:id', cartController.updateCart.bind(cartController)); // actualizar productos
router.delete('/:id', cartController.deleteCart.bind(cartController)); // eliminar carrito

// Ruta para obtener carrito por user_id y id
router.get('/:user_id/:id', async (req, res) => {
  try {
    const { user_id, id } = req.params;
    // Busca el carrito por id y valida que pertenezca al user_id
    const cart = await cartController.getCartById({
      ...req,
      params: { id }
    }, {
      ...res,
      json: (data) => {
        if (data && data.user_id && data.user_id != user_id) {
          return res.status(404).json({ error: 'Carrito no encontrado para este usuario' });
        }
        res.json(data);
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor', message: error.message });
  }
});

module.exports = router;