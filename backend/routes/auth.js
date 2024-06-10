const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET_KEY = 'sua-chave-secreta-super-segura';

let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

// Função para gerar um token JWT
function generateToken(user) {
  return jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
}

// Endpoint de login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Gera um token JWT se as credenciais forem válidas
    const token = generateToken(user);
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
});

module.exports = router;
