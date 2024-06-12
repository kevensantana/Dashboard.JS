const User = require('../models/User');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'sua-chave-secreta-super-segura';

function generateToken(user) {
  return jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
}

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      const token = generateToken(user);
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor', error: err });
  }
};
