const express = require('express');
const path = require('path');
const router = express.Router();

// Rota para servir páginas HTML
router.get('/pages/:page', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, '../../frontend/src/pages', `${page}.html`));
});

// Rota para servir arquivos JS
router.get('/scripts/:script', (req, res) => {
  const script = req.params.script;
  res.sendFile(path.join(__dirname, '../../frontend/src/scripts', `${script}.js`));
});

// Rota para servir arquivos CSS
router.get('/styles/:style', (req, res) => {
  const style = req.params.style;
  res.sendFile(path.join(__dirname, '../../frontend/src/styles', `${style}.css`));
});

module.exports = router;
