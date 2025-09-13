const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Aplicar autenticación a todas las rutas
router.use(verifyToken);


// Solo la ruta de paginación/listado de carritos
router.get('/', cartController.getAllCarts.bind(cartController));

module.exports = router;