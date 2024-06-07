const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3000;


// Definir o tipo MIME para arquivos JavaScript
express.static.mime.define({'application/javascript': ['js']});

// Servir arquivos estáticos a partir do diretório 'public'
app.use(express.static(path.join(__dirname, 'public')));


// Chave secreta para assinar tokens
const SECRET_KEY = 'sua-chave-secreta-super-segura';

app.use(bodyParser.json());
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
    res.json({ 
      username: user.username, 
      email: user.email,  
      address: user.address,
      phone: user.phone,
      balance: user.balance});
  } else {
    res.status(404).json({ message: 'Usuário não encontrado' });
  }
});

// Novo endpoint para atualizar o perfil
app.post('/updateProfile', authenticateToken, (req, res) => {
  const { username, email, address, phone } = req.body;
  const user = users.find(u => u.username === req.user.username);

  if (user) {
    user.username = username;
    user.email = email;
    user.address = address;
    user.phone = phone;
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));  // Atualiza o arquivo users.json
    res.json({ success: true });
  } else {
    res.status(404).json({ message: 'Usuário não encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
