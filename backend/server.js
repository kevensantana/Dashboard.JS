const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();  // Carregar variáveis de ambiente do arquivo .env

const app = express();
const PORT = process.env.PORT || 3000;

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(bodyParser.json());

// Configurar rotas estáticas
app.use('/', require('./routes/staticRoutes'));

// Configurar rotas de autenticação
app.use('/auth', require('./routes/auth'));

// Configurar outras rotas
app.use('/profile', require('./routes/profile'));
app.use('/updateProfile', require('./routes/updateProfile'));
// app.use('/financeiro', require('./routes/finance'));

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
