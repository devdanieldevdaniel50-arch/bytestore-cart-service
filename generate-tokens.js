const jwt = require('jsonwebtoken');
const config = require('./src/config/config');
const { randomUUID } = require('crypto');

// Usuarios de ejemplo para generar tokens
const users = [
  {
    id: randomUUID(), // UUID válido para admin
    email: 'test@test.test',
    role: 'ADMINISTRADOR',
    name: 'Admin User'
  },
  {
    id: randomUUID(), // UUID válido para usuario normal
    email: 'correo@electronico.com',
    role: 'USUARIO',
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
  console.log(`  user_id: ${user.id}`);
  console.log(`  Token: Bearer ${token}\n`);

  if (index === 0) {
    console.log(' Para tu test-api.js, usa:');
    console.log(`const adminToken = 'Bearer ${token}';`);
    console.log(`const adminUserId = '${user.id}';`);
  } else {
    console.log(`const userToken = 'Bearer ${token}';`);
    console.log(`const userUserId = '${user.id}';`);
  }
  console.log('─'.repeat(80));
});

console.log('\n Tokens generados correctamente!');
console.log(' Copiar estos tokens y user_id y reemplazar en el test-api.js');