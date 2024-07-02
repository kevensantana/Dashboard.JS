const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('../models/Users.js');
const User = mongoose.model('Users');

const SECRET_KEY = 'seu-segredo-aqui'; // Chave secreta para o JWT

// Endpoint para login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });

        if (user) {
            const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Nome de usuário ou senha incorretos' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erro no servidor', error: err });
    }
});

// Endpoint para cadastro
router.post('/register', async (req, res) => {
    const { username, password, email, age, phone, address } = req.body;
    let errors = [];

    if (!username) errors.push({ message: "Nome de usuário inválido" });
    if (!password) errors.push({ message: "Senha inválida" });
    if (!email) errors.push({ message: "Email inválido" });
    if (password && password.length < 4) errors.push({ message: "Senha muito curta" });

    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors });
    }

    try {
        const userExists = await User.findOne({ $or: [{ username }, { email }] });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'Usuário ou email já cadastrado' });
        } else {
            const newUser = new User({ username, password, email, age, phone, address});
            await newUser.save();
            res.json({ success: true });
        }
        

    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário', error: err });
    }
});

// Middleware para verificar o token JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Endpoint para obter informações do usuário
router.get('/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro ao buscar usuário', error: err });
    }
});

// Endpoint para atualizar informações do usuário
router.post('/update-profile', authenticateToken, async (req, res) => {
    const { username, email, address, phone, balance } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.username = username || user.username;
            user.email = email || user.email;
            user.address = address || user.address;
            user.phone = phone || user.phone;
            user.balance = balance || user.balance;

            await user.save();
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro ao atualizar usuário', error: err });
    }
});

module.exports = router;
