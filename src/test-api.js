// Script de pruebas para el API de carritos
// Ejecutar con: node test-api.js

const baseURL = 'http://localhost:8000';

// Tokens de ejemplo (estos serían generados por tu sistema de autenticación)
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxOTg5NDkzLTBkZWYtN2Y0MS1hYjQwLTIwYjA0Njc5ZmJiNCIsImVtYWlsIjoidGVzdEB0ZXN0LnRlc3QiLCJyb2xlIjoxLCJpYXQiOjE3NTc3Mzk5MDMsImV4cCI6MTc1NzgyNjMwM30.EMolJen_YlMzxDlazlwO_8tFRqBnHMP9z-Wn-yMfjrg';
const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlV4SWRQcHQiLCJlbWFpbCI6ImNvcnJlb0BlbGVjdHJvbmljby5jb20iLCJyb2xlIjowLCJpYXQiOjE3NTc3Mzk5MDMsImV4cCI6MTc1NzgyNjMwM30.t66QTu1uWWcug3ia_lpKjMa0G9Ne_Jev6OUdLeb6VJc';

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
  console.log(' Iniciando pruebas del API de carritos');

  // 1. Verificar salud del servicio
  await makeRequest('/health');

  // 2. Obtener carritos como admin
  await makeRequest('/carts', {
    headers: { 'Authorization': adminToken }
  });

  // 3. Obtener carritos con paginación
  await makeRequest('/carts?_page=1&_per_page=5', {
    headers: { 'Authorization': adminToken }
  });

  // 4. Obtener carrito específico
  await makeRequest('/carts/01989493-0def-7f41-ab40-20b04679f745', {
    headers: { 'Authorization': adminToken }
  });

  // 5. Obtener carrito por usuario (se crea automáticamente si no existe)
  await makeRequest('/carts/user/UxIdPpt', {
    headers: { 'Authorization': userToken }
  });

  // 6. Crear nuevo carrito
  await makeRequest('/carts', {
    method: 'POST',
    headers: { 'Authorization': adminToken },
    body: JSON.stringify({
      user_id: 'nuevo-usuario-test'
    })
  });

  // 7. Agregar producto al carrito
  await makeRequest('/carts/01989493-0def-7f41-ab40-20b04679f745/products', {
    method: 'POST',
    headers: { 'Authorization': adminToken },
    body: JSON.stringify({
      id: 'AA-AA-AA-A1',
      quantity: 1
    })
  });

  // 8. Actualizar cantidad de producto
  await makeRequest('/carts/01989493-0def-7f41-ab40-20b04679f745/products/AA-AA-AA-A1', {
    method: 'PUT',
    headers: { 'Authorization': adminToken },
    body: JSON.stringify({
      quantity: 3
    })
  });

  // 9. Intentar acceso sin token (debe fallar)
  await makeRequest('/carts');

  // 10. Intentar acceso con token inválido (debe fallar)
  await makeRequest('/carts', {
    headers: { 'Authorization': 'token-invalido' }
  });

  console.log('\n Pruebas completadas');
}

// Solo ejecutar si este archivo se ejecuta directamente
if (require.main === module) {
  runTests();
}

module.exports = { makeRequest, runTests };