// Script de pruebas para el API de carritos
// Ejecutar con: node test-api.js

const baseURL = 'http://localhost:8000';

// Tokens de ejemplo (estos serían generados por tu sistema de autenticación)
// Tokens de ejemplo válidos (NO usar en producción)
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluLTEyMyIsImVtYWlsIjoiYWRtaW5AZW1haWwuY29tIiwicm9sZSI6IkFETUlOSVNUUkFET1IiLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.2QwQnQw6QwQnQw6QwQnQw6QwQnQw6QwQnQw6QwQnQw';
const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItNDU2IiwiZW1haWwiOiJ1c2VyQGVtYWlsLmNvbSIsInJvbGUiOiJVU0VSSU8iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.3QwQnQw6QwQnQw6QwQnQw6QwQnQw6QwQnQw6QwQnQw';

const fetch = require('node-fetch');

async function makeRequest(endpoint, options = {}) {
  const url = `${baseURL}${endpoint}`;
  const isCartEndpoint = endpoint.startsWith('/carts');
  const token = options.token || adminToken;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(isCartEndpoint ? { 'Authorization': token } : {})
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

  // 1. Obtener carritos paginados (GET /)
  await makeRequest('/', {
    headers: { 'Authorization': adminToken }
  });

  // 2. Crear nuevo carrito (POST /)
  await makeRequest('/', {
    method: 'POST',
    headers: { 'Authorization': adminToken },
    body: JSON.stringify({
      user_id: 'test-user-1',
      products: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 1 }
      ]
    })
  });

  // 3. Actualizar productos del carrito (PUT /:id)
  await makeRequest('/test-user-1', {
    method: 'PUT',
    headers: { 'Authorization': adminToken },
    body: JSON.stringify({
      products: [
        { id: 1, quantity: 5 },
        { id: 3, quantity: 1 }
      ]
    })
  });

  // 4. Eliminar carrito (DELETE /:id)
  await makeRequest('/test-user-1', {
    method: 'DELETE',
    headers: { 'Authorization': adminToken }
  });

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