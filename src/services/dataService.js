
const mongoose = require('mongoose');

// Definir el esquema de carrito
const cartSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  products: [
    {
      id: String,
      name: String,
      image: String,
      price: Number,
      discount: Number,
      quantity: Number,
      brand: String,
      model: String,
      stock: Number
    }
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);


class DataService {
  // Obtener carritos (con filtro por usuario si se requiere)
  async getCarts(filters = {}) {
    let query = {};
    if (filters.user_id) {
      query.user_id = filters.user_id;
    }
    return await Cart.find(query).lean();
  }

  // Paginación (sobre un array de carritos)
  paginate(data, page = 1, perPage = 10) {
    const items = data.length;
    const pages = Math.ceil(items / perPage);
    const currentPage = Math.max(1, Math.min(page, pages));
    const first = 1;
    const prev = currentPage > 1 ? currentPage - 1 : null;
    const next = currentPage < pages ? currentPage + 1 : null;
    const last = pages;
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const paginatedData = data.slice(start, end);
    return {
      first,
      prev,
      next,
      last,
      pages,
      items,
      data: paginatedData
    };
  }
}

module.exports = new DataService();