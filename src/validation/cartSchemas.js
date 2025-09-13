const { z } = require('zod');

const createCartSchema = z.object({
  user_id: z.string().min(1, 'user_id es requerido'),
  products: z.array(z.object({
    id: z.union([z.string(), z.number()]),
    quantity: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
  })).optional(),
});

const updateCartSchema = z.object({
  products: z.array(z.object({
    id: z.union([z.string(), z.number()]),
    quantity: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
  }))
});

module.exports = {
  createCartSchema,
  updateCartSchema,
};
