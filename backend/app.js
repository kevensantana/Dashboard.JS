const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');

require('dotenv').config();  // Carregar variáveis de ambiente do arquivo .env


const PORT = process.env.PORT || 3000;

// config total

// Sessão:
  app.use(session({
    secret: 'seusegredoaqui',
    resave: true,
    saveUninitialized: true
  }));

// Flash:
  app.use(flash()); 

//Middleware
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
  });

//Body Parser 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Handlebars
app.engine('handlebars', engine({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');
  
// Conexão com o MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Conectado ao MongoDB'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));
  
//public
  app.use(express.static(path.join(__dirname, '../frontend')));
  app.use(express.static(path.join(__dirname, 'public')));
  

    
// Rota padrão redirecionada para página de login
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
  });

  
// Routes
  app.use('/admin', require('./routes/admin.js')); // Rota de administração
  app.use('/', require('./routes/staticRoutes.js'))
  app.use('/auth', require('./routes/auth')); // Rotas de autenticação
  app.use('/finance', require('./routes/finance')); // Rotas de finanças
  

  // Definir o tipo MIME para arquivos JavaScript e CSS
  express.static.mime.define({'application/javascript': ['js']});
  express.static.mime.define({'text/css': ['css']});


// Iniciar o servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


// Exportar o servidor para testes
module.exports = server;