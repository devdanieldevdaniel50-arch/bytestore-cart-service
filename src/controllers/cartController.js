const dataService = require('../services/dataService');

class CartController {
  // GET /carts - Obtener todos los carritos (solo admin) o del usuario actual
  /**
   * @api {get} /carts Listar carritos con paginación
   * @apiQuery {Number} [_page=1] Página actual
   * @apiQuery {Number} [_per_page=10] Elementos por página
   * @apiQuery {String} [user_id] Filtrar por usuario (solo admin)
   * @apiSuccess {Number} first Página inicial
   * @apiSuccess {Number|null} prev Página anterior
   * @apiSuccess {Number|null} next Página siguiente
   * @apiSuccess {Number} last Última página
   * @apiSuccess {Number} pages Total de páginas
   * @apiSuccess {Number} items Total de elementos
   * @apiSuccess {Array} data Carritos de la página
   */
  getAllCarts(req, res) {
    try {
      const { _page, _per_page, user_id } = req.query;
      const page = parseInt(_page) || 1;
      const perPage = parseInt(_per_page) || 10;

      let filters = {};
      // Si no es admin, solo puede ver su propio carrito
      if (req.user.role !== 1) {
        filters.user_id = req.user.id;
      } else if (user_id) {
        filters.user_id = user_id;
      }

      const carts = dataService.getCarts(filters);
      // Siempre retornar paginación extendida
      const result = dataService.paginate(carts, page, perPage);
      return res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: error.message 
      });
    }
  }

  // Solo la función de paginación de carritos
  /**
   * @api {get} /carts Listar carritos con paginación
   * @apiQuery {Number} [_page=1] Página actual
   * @apiQuery {Number} [_per_page=10] Elementos por página
   * @apiQuery {String} [user_id] Filtrar por usuario (solo admin)
   * @apiSuccess {Number} first Página inicial
   * @apiSuccess {Number|null} prev Página anterior
   * @apiSuccess {Number|null} next Página siguiente
   * @apiSuccess {Number} last Última página
   * @apiSuccess {Number} pages Total de páginas
   * @apiSuccess {Number} items Total de elementos
   * @apiSuccess {Array} data Carritos de la página
   */
  getAllCarts(req, res) {
    try {
      const { _page, _per_page, user_id } = req.query;
      const page = parseInt(_page) || 1;
      const perPage = parseInt(_per_page) || 10;

      let filters = {};
      // Si no es admin, solo puede ver su propio carrito
      if (req.user.role !== 1) {
        filters.user_id = req.user.id;
      } else if (user_id) {
        filters.user_id = user_id;
      }

      const carts = dataService.getCarts(filters);
      // Siempre retornar paginación extendida
      const result = dataService.paginate(carts, page, perPage);
      return res.json(result);
    } catch (error) {
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: error.message 
      });
    }
  }
}

module.exports = new CartController();