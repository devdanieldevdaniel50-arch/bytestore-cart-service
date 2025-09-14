// Script de pruebas para el API de carritos
// Ejecutar con: node test-api.js

const baseURL = 'http://localhost:8000';

// Tokens de ejemplo (estos serían generados por tu sistema de autenticación)
// Tokens de ejemplo válidos (NO usar en producción)
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxOTg5NDkzLTBkZWYtN2Y0MS1hYjQwLTIwYjA0Njc5ZmJiNCIsImVtYWlsIjoidGVzdEB0ZXN0LnRlc3QiLCJyb2xlIjoxLCJpYXQiOjE3NTc4MTczODUsImV4cCI6MTc1NzkwMzc4NX0.XQkNcEG5b9ohZ3pLsYGCEcCxUU_EPE7zpq0yiPMRjOM';
const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlV4SWRQcHQiLCJlbWFpbCI6ImNvcnJlb0BlbGVjdHJvbmljby5jb20iLCJyb2xlIjowLCJpYXQiOjE3NTc4MTczODUsImV4cCI6MTc1NzkwMzc4NX0.qS0lEdycGzomECJLiJ2qBHEu8Oio6879S6dSX5n0UAU';

const fetch = require('node-fetch');

async function makeRequest(endpoint, options = {}) {
  const url = `${baseURL}${endpoint}`;
  // Eliminar referencia a /carts, ya no se usa prefijo
  const token = options.token || adminToken;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { 'Authorization': token } : {})
    },
    ...options
  };

  try {
    console.log(`\n ${config.method || 'GET'} ${endpoint}`);
    const response = await fetch(url, config);
    let data;
    try {
      data = await response.json();
    } catch (e) {
      data = await response.text();
    }
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    return { status: response.status, data };
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return { error: error.message };
  }
}

async function runTests() {
  console.log(' Iniciando pruebas del API de carritos (CRUD principal)');

  // 1. Crear un carrito válido (POST /)
  // Usar un user_id que ya existe en db.json para asegurar éxito en las pruebas
  const userId = '01989493-0def-7f41-ab40-20b04679fbb4';
  const createRes = await makeRequest('/', {
    method: 'POST',
    headers: { 'Authorization': adminToken },
    body: JSON.stringify({
      user_id: userId,
      products: [
        {
          id: 'AA-AA-AA-AA',
          name: 'HP Intel Core I3 - 8GB',
          model: '15-fd0026la',
          price: 3299000,
          discount: 54,
          stock: 10,
          image: 'http://localhost:8001/images/198122843657-001-750Wx750H.webp',
          brand: 'HP',
          quantity: 1
        }
      ]
    })
  });
  const cartId = createRes.data && createRes.data.id;


  // 2. Obtener carrito por user_id usando query param (GET /cart?user_id=...)
  await makeRequest(`/cart?user_id=${userId}`, {
    headers: { 'Authorization': adminToken }
  });

  // 4. Eliminar carrito (DELETE /:id)
  if (cartId) {
    await makeRequest(`/${cartId}`, {
      method: 'DELETE',
      headers: { 'Authorization': adminToken }
    });
  }

  // 5. Intentar crear carrito con datos inválidos
  await makeRequest('/', {
    method: 'POST',
    headers: { 'Authorization': adminToken },
    body: JSON.stringify({
      user_id: '',
      products: 'no-es-array'
    })
  });

  // 6. Intentar acceso sin token (debe fallar)
  await makeRequest('/');

  // 7. Intentar acceso con token inválido (debe fallar)
  await makeRequest('/', {
    headers: { 'Authorization': 'token-invalido' }
  });

  console.log('\n Pruebas CRUD completadas');
}

// Solo ejecutar si este archivo se ejecuta directamente
if (require.main === module) {
  runTests();
}

module.exports = { makeRequest, runTests };