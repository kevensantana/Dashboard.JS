const express = require('express');
const path = require('path');
const router = express.Router();

// Função utilitária para validar nomes de arquivos
function isValidFilename(filename) {
  return /^[a-zA-Z0-9-_]+$/.test(filename);
}

// Rota para servir páginas HTML
router.get('/pages/:page', (req, res) => {
  const page = req.params.page;
  if (!isValidFilename(page)) {
    return res.status(400).send('Invalid page name');
  }
  const filePath = path.join(__dirname, '../../frontend/src/pages', `${page}.html`);
  res.sendFile(filePath, err => {
    if (err) {
      res.status(err.status || 500).send('Error serving the page');
    }
  });
});

// Rota para servir arquivos JS
router.get('/scripts/:script', (req, res) => {
  const script = req.params.script;
  if (!isValidFilename(script)) {
    return res.status(400).send('Invalid script name');
  }
  const filePath = path.join(__dirname, '../../frontend/src/scripts', `${script}.js`);
  res.sendFile(filePath, err => {
    if (err) {
      res.status(err.status || 500).send('Error serving the script');
    }
  });
});

// Rota para servir arquivos CSS
router.get('/styles/:style', (req, res) => {
  const style = req.params.style;
  if (!isValidFilename(style)) {
    return res.status(400).send('Invalid style name');
  }
  const filePath = path.join(__dirname, '../../frontend/src/styles', `${style}.css`);
  res.sendFile(filePath, err => {
    if (err) {
      res.status(err.status || 500).send('Error serving the style');
    }
  });
});

module.exports = router;
