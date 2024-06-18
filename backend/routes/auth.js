const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken'); // Para gerar tokens de autenticação
const { v4: uuidv4 } = require('uuid'); // Para gerar IDs únicos

const router = express.Router();
const SECRET_KEY = 'seu-segredo-aqui'; // Chave secreta para o JWT

// Função para ler usuários do arquivo JSON
const readUsers = (callback) => {
    const userFilePath = path.resolve(__dirname, '../db/users.json');
    fs.readFile(userFilePath, (err, data) => {
        if (err) {
            console.error('Erro ao ler users.json:', err);
            return callback([]);
        }
        callback(JSON.parse(data));
    });
};

// Função para escrever usuários no arquivo JSON
const writeUsers = (users, callback) => {
    const userFilePath = path.resolve(__dirname, '../db/users.json');
    fs.writeFile(userFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error('Erro ao salvar users.json:', err);
            callback(err);
        } else {
            callback(null);
        }
    });
};

// Endpoint para login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    readUsers((users) => {
        const user = users.find(user => user.username === username && user.password === password);
        
        // Função para gerar um token JWT
        if (user) {
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Nome de usuário ou senha incorretos' });
        }
    });
});

// Endpoint para cadastro
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    readUsers((users) => {
        // Verificar se o usuário ou email já existe
        const userExists = users.some(user => user.username === username || user.email === email);

        if (userExists) {
            res.json({ success: false, message: 'Usuário ou email já cadastrado' });
        } else {
            const newUser = {
                id: uuidv4(),
                username,
                email,
                password
            };
            users.push(newUser);

            writeUsers(users, (err) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'Erro ao salvar usuário' });
                } else {
                    res.json({ success: true });
                }
            });
        }
    });
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
router.get('/user', authenticateToken, (req, res) => {
    console.log('Token JWT decodificado:', req.user); // Adicionado para depuração
    readUsers((users) => {
        const user = users.find(u => u.id === req.user.id);
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
    });
});

module.exports = router;
