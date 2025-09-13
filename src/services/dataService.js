const fs = require('fs-extra');
const path = require('path');

class DataService {
  // Devuelve todos los carritos o filtra por user_id si se pasa en filters
  async getCarts(filters = {}) {
    const carts = await this.getAllCarts();
    if (filters.user_id) {
      return carts.filter(cart => cart.user_id === filters.user_id);
    }
    return carts;
  }

  // Devuelve el carrito de un usuario por su user_id (solo uno)
  async getCartByUserId(userId) {
    const carts = await this.getAllCarts();
    return carts.find(cart => cart.user_id === userId);
  }

  // Paginación simple (usada en el controlador)
  paginate(items, page = 1, perPage = 10) {
    const total = items.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
      page,
      perPage,
      total,
      totalPages,
      items: items.slice(start, end)
    };
  }
  constructor() {
    this.dataFilePath = path.join(__dirname, '../data/db.json');
    this.initializeData();
  }

  async initializeData() {
    try {
      await fs.ensureDir(path.dirname(this.dataFilePath));
      const exists = await fs.pathExists(this.dataFilePath);
      if (!exists) {
        await fs.writeJSON(this.dataFilePath, { carts: [] }, { spaces: 2 });
        console.log('Archivo db.json inicializado');
      }
    } catch (error) {
      console.error('Error al inicializar datos:', error);
    }
  }

  async readData() {
    try {
      return await fs.readJSON(this.dataFilePath);
    } catch (error) {
      console.error('Error al leer datos:', error);
      return { carts: [] };
    }
  }

  async writeData(data) {
    try {
      await fs.writeJSON(this.dataFilePath, data, { spaces: 2 });
      return true;
    } catch (error) {
      console.error('Error al escribir datos:', error);
      return false;
    }
  }

  async getAllCarts() {
    const data = await this.readData();
    return data.carts || [];
  }

  async getCartById(id) {
    const data = await this.readData();
    return data.carts.find(cart => cart.id === id);
  }

  async getCartsByUser(userId) {
    const data = await this.readData();
    return data.carts.filter(cart => cart.userId === userId);
  }

  async createCart(cartData) {
    const data = await this.readData();
    data.carts.push(cartData);
    await this.writeData(data);
    return cartData;
  }

  async updateCart(id, updates) {
    const data = await this.readData();
    const cartIndex = data.carts.findIndex(cart => cart.id === id);
    
    if (cartIndex === -1) return null;
    
    data.carts[cartIndex] = { 
      ...data.carts[cartIndex], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    
    await this.writeData(data);
    return data.carts[cartIndex];
  }

  async addProductToCart(cartId, product) {
    const data = await this.readData();
    const cartIndex = data.carts.findIndex(cart => cart.id === cartId);
    
    if (cartIndex === -1) return null;
    
    const cart = data.carts[cartIndex];
    const existingProductIndex = cart.products.findIndex(p => p.productId === product.productId);
    
    if (existingProductIndex !== -1) {
      // Si el producto ya existe, actualizar cantidad
      cart.products[existingProductIndex].quantity += product.quantity;
      cart.products[existingProductIndex].updatedAt = new Date().toISOString();
    } else {
      // Si es nuevo producto, agregarlo
      cart.products.push(product);
    }
    
    cart.updatedAt = new Date().toISOString();
    await this.writeData(data);
    return cart;
  }

  async updateProductInCart(cartId, productId, quantity) {
    const data = await this.readData();
    const cartIndex = data.carts.findIndex(cart => cart.id === cartId);
    
    if (cartIndex === -1) return null;
    
    const cart = data.carts[cartIndex];
    const productIndex = cart.products.findIndex(p => p.productId === productId);
    
    if (productIndex === -1) return null;
    
    if (quantity === 0) {
      // Si la cantidad es 0, eliminar el producto
      cart.products.splice(productIndex, 1);
    } else {
      // Actualizar cantidad
      cart.products[productIndex].quantity = quantity;
      cart.products[productIndex].updatedAt = new Date().toISOString();
    }
    
    cart.updatedAt = new Date().toISOString();
    await this.writeData(data);
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const data = await this.readData();
    const cartIndex = data.carts.findIndex(cart => cart.id === cartId);
    
    if (cartIndex === -1) return null;
    
    const cart = data.carts[cartIndex];
    const productIndex = cart.products.findIndex(p => p.productId === productId);
    
    if (productIndex === -1) return null;
    
    cart.products.splice(productIndex, 1);
    cart.updatedAt = new Date().toISOString();
    
    await this.writeData(data);
    return cart;
  }

  async deleteCart(id) {
    const data = await this.readData();
    const cartIndex = data.carts.findIndex(cart => cart.id === id);
    
    if (cartIndex === -1) return false;
    
    data.carts.splice(cartIndex, 1);
    await this.writeData(data);
    return true;
  }
}

module.exports = new DataService();