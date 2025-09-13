
const dataService = require('../services/dataService');

class CartController {
  // Obtener todos los carritos (admin ve todos, usuario solo el suyo)
  async getAllCarts(req, res) {
    try {
      const { _page, _per_page, user_id } = req.query;
      const page = parseInt(_page) || 1;
      const perPage = parseInt(_per_page) || 10;
      let filters = {};
      if (req.user.role !== 'admin') {
        filters.user_id = req.user.id;
      } else if (user_id) {
        filters.user_id = user_id;
      }
      const carts = await dataService.getCarts(filters);
      const result = dataService.paginate(carts, page, perPage);
      return res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
  }

  // Obtener un carrito por ID
  async getCartById(req, res) {
    try {
      const { id } = req.params;
      const cart = await dataService.getCartById(id);
      if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
      // Solo el dueño o admin puede ver el carrito
      if (req.user.role !== 'admin' && cart.user_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para ver este carrito' });
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
  }

  // Crear un carrito para el usuario autenticado (si no existe)
  async createCart(req, res) {
    try {
      // Solo puede crear su propio carrito
      const userId = req.user.id;
      let cart = await dataService.getCartByUserId(userId);
      if (cart) return res.status(409).json({ error: 'Ya tienes un carrito' });
      cart = await dataService.createCart({ user_id: userId, products: [] });
      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
  }

  // Actualizar un carrito (solo el dueño o admin)
  async updateCart(req, res) {
    try {
      const { id } = req.params;
      const cart = await dataService.getCartById(id);
      if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
      if (req.user.role !== 'admin' && cart.user_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para modificar este carrito' });
      }
      // Solo se permite actualizar productos
      const { products } = req.body;
      const updated = await dataService.updateCart(id, { products });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
  }

  // Eliminar un carrito (solo si está vacío)
  async deleteCart(req, res) {
    try {
      const { id } = req.params;
      const cart = await dataService.getCartById(id);
      if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
      if (req.user.role !== 'admin' && cart.user_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para eliminar este carrito' });
      }
      if (cart.products && cart.products.length > 0) {
        return res.status(400).json({ error: 'Solo puedes eliminar un carrito vacío' });
      }
      await dataService.deleteCart(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
  }

  // Agregar un producto al carrito
  async addProductToCart(req, res) {
    try {
      const { id } = req.params; // id del carrito
      const { id: productId, ...productData } = req.body;
      const cart = await dataService.getCartById(id);
      if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
      if (req.user.role !== 'admin' && cart.user_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para modificar este carrito' });
      }
      // Si el producto ya existe, no lo duplica, solo suma cantidad
      let found = false;
      const newProducts = cart.products.map(p => {
        if (p.id === productId) {
          found = true;
          return { ...p, quantity: (p.quantity || 0) + (productData.quantity || 1) };
        }
        return p;
      });
      if (!found) {
        newProducts.push({ id: productId, ...productData });
      }
      const updated = await dataService.updateCart(id, { products: newProducts });
      res.status(201).json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
  }

  // Actualizar la cantidad de un producto en el carrito
  async updateProductInCart(req, res) {
    try {
      const { id, productId } = req.params;
      const { quantity } = req.body;
      const cart = await dataService.getCartById(id);
      if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
      if (req.user.role !== 'admin' && cart.user_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para modificar este carrito' });
      }
      const newProducts = cart.products.map(p =>
        p.id === productId ? { ...p, quantity } : p
      );
      const updated = await dataService.updateCart(id, { products: newProducts });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
  }

  // Eliminar un producto del carrito
  async removeProductFromCart(req, res) {
    try {
      const { id, productId } = req.params;
      const cart = await dataService.getCartById(id);
      if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
      if (req.user.role !== 'admin' && cart.user_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para modificar este carrito' });
      }
      const newProducts = cart.products.filter(p => p.id !== productId);
      const updated = await dataService.updateCart(id, { products: newProducts });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
  }

  // Vaciar el carrito por completo
  async clearCart(req, res) {
    try {
      const { id } = req.params;
      const cart = await dataService.getCartById(id);
      if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
      if (req.user.role !== 'admin' && cart.user_id !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para modificar este carrito' });
      }
      const updated = await dataService.updateCart(id, { products: [] });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor', message: error.message });
    }
  }
}

module.exports = new CartController();