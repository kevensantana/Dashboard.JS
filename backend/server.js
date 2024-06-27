const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();  // Carregar variáveis de ambiente do arquivo .env

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com o MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('Conectado ao MongoDB'))
//   .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Middleware
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(bodyParser.json());

// Routes
app.use('/', require('./routes/staticRoutes')); // Rota principal
app.use('/auth', require('./routes/auth')); // Rotas de autenticação
app.use('/profile', require('./routes/profile')); // Rotas de perfil
app.use('/updateProfile', require('./routes/updateProfile')); // Rotas de atualização de perfil
app.use('/finance', require('./routes/finance')); // Rotas de finanças

// Rota padrão redirecionada para página de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
});

// Redirecionar a rota raiz para a página de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
});

// Definir o tipo MIME para arquivos JavaScript e CSS
express.static.mime.define({'application/javascript': ['js']});
express.static.mime.define({'text/css': ['css']});

// Iniciar o servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


// Exportar o servidor para testes
module.exports = server;