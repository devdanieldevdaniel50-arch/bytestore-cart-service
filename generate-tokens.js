const jwt = require('jsonwebtoken');
const config = require('./src/config/config');

// Usuarios de ejemplo para generar tokens
const users = [
  {
    id: '01989493-0def-7f41-ab40-20b04679fbb4',
    email: 'test@test.test',
    role: 1,
    name: 'Admin User'
  },
  {
    id: 'UxIdPpt', 
    email: 'correo@electronico.com',
    role: 0,
    name: 'Regular User'
  }
];

console.log('🔑 Generando tokens válidos...\n');

users.forEach((user, index) => {
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    config.jwtSecret,
    { expiresIn: '24h' }
  );
  
  console.log(` Usuario ${index + 1}: ${user.name} (${user.email})`);
  console.log(`  Token: Bearer ${token}\n`);
  
  if (index === 0) {
    console.log(' Para tu test-api.js, usa:');
    console.log(`const adminToken = 'Bearer ${token}';`);
  } else {
    console.log(`const userToken = 'Bearer ${token}';`);
  }
  console.log('─'.repeat(80));
});

console.log('\n Tokens generados correctamente!');
console.log(' Copiar estos tokens y reemplazar en el test-api.js');