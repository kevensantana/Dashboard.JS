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



// Configurar rotas estáticas
app.use('/', require('./routes/staticRoutes'));;

// Rotas para servir as páginas HTML
app.get('/pages/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(process.cwd(), '../frontend/src/pages', page));
});

// Rotas para servir arquivos de estilo e scripts
app.get('/styles/:file', (req, res) => {
  const file = req.params.file;
  res.sendFile(path.join(process.cwd(), '../frontend/src/styles', file));
});

app.get('/scripts/:file', (req, res) => {
  const file = req.params.file;
  res.sendFile(path.join(process.cwd(), '../frontend/src/scripts', file));
});

// Configurar rotas
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/updateProfile', require('./routes/updateProfile'));

// Redirecionar a rota raiz para a página de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
  console.log("Tudo ok")
});



// Definir o tipo MIME para arquivos JavaScript
express.static.mime.define({'application/javascript': ['js']});
express.static.mime.define({'text/css': ['css']});

// Iniciar o servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Exportar o servidor para testes
module.exports = server;
