const express = require('express');
const fs = require('fs');
const router = express.Router();


let users = JSON.parse(fs.readFileSync('db/data.json', 'utf8'));

// Endpoint protegido para obter informações do perfil
router.get('/', (req, res) => {
  const user = users.find(u => u.username === req.user.username);
  if (user) {
    res.json({
      username: user.username,
      email: user.email,
      address: user.address,
      phone: user.phone,
      balance: user.balance
    });
  } else {
    res.status(404).json({ message: 'Usuário não encontrado' });
  }
});

module.exports = router;