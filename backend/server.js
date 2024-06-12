const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();  // Carregar variáveis de ambiente do arquivo .env

const app = express();
const PORT = process.env.PORT || 3000;

// console.log('Mongo URI:', process.env.MONGO_URI);

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));


// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(bodyParser.json());

// Configurar rotas
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/updateProfile', require('./routes/updateProfile'));

// Definir o tipo MIME para arquivos JavaScript
express.static.mime.define({'application/javascript': ['js']});

// Iniciar o servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Exportar o servidor para testes
module.exports = server;
