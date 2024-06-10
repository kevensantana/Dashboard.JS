const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.json());

// Configurar rotas
app.use('/auth', require('./backend/routes/auth'));
app.use('/profile', require('./backend/routes/profile'));
app.use('/updateProfile', require('./backend/routes/updateProfile'));

// Definir o tipo MIME para arquivos JavaScript
express.static.mime.define({'application/javascript': ['js']});

// Iniciar o servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Exportar o servidor para testes
module.exports = server;
