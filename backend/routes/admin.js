const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/', (req, res) => {
  res.render("admin/index");
});

router.get('/post', (req, res) => {
  res.send('Página de administração');
});


module.exports = router;