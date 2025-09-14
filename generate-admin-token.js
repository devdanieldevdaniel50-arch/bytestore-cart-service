// Script para generar un token válido con role ADMINISTRADOR
const jwt = require('jsonwebtoken');

const payload = {
  id: '01989493-0def-7f41-ab40-20b04679fbb4',
  email: 'admin@test.com',
  role: 'ADMINISTRADOR',
};

const secret = '@y*&0a%K%7P0t@uQ^38HN$y4Z^PK#0zE7dem700Bbf&pC6HF$aU^ARkE@u$nn';
const token = jwt.sign(payload, secret, { expiresIn: '30d' });
console.log(token);
