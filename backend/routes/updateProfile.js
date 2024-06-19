const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = 'sua-chave-secreta-super-segura';

let users = JSON.parse(fs.readFileSync('db/users.json', 'utf8'));

// Middleware para verificar o token JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Novo endpoint para atualizar o perfil
router.post('/updateProfile', authenticateToken, (req, res) => {
  const { username, email, address, phone } = req.body;
  const user = users.find(u => u.username === req.user.username);

  if (user) {
    user.username = username;
    user.email = email;
    user.address = address;
    user.phone = phone;
    fs.writeFileSync('db/users.json', JSON.stringify(users, null, 2));  // Atualiza o arquivo users.json
    res.json({ success: true });
  } else {
    res.status(404).json({ message: 'Usuário não encontrado' });
  }
});

module.exports = router;
