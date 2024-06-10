const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = 'sua-chave-secreta-super-segura';

let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

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

// Endpoint protegido para obter informações do perfil
router.get('/', authenticateToken, (req, res) => {
  const user = users.find(u => u.username === req.user.username);
  if (user) {
    res.json({
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
      balance: user.balance
    });
  } else {
    res.status(404).json({ message: 'Usuário não encontrado' });
  }
});

module.exports = router;
