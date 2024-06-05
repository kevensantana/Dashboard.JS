const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Chave secreta para assinar tokens
const SECRET_KEY = 'sua-chave-secreta-super-segura';

app.use(bodyParser.json());

// Configura a pasta 'public' como a fonte dos arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

let users = JSON.parse(fs.readFileSync('users.json', 'utf8'));

// Função para gerar um token JWT
function generateToken(user) {
  return jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
}

// Endpoint de login
app.post('/login', (req, res) => {
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
app.get('/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.username === req.user.username);
  if (user) {
    res.json({ username: user.username, email: user.email });
  } else {
    res.status(404).json({ message: 'Usuário não encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
