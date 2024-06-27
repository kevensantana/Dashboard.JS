const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const SECRET_KEY = 'seu-segredo-aqui'; // Chave secreta para o JWT
const userFilePath = path.resolve(__dirname, '../db/data.json');

// Função para ler usuários do arquivo JSON
const readUsersFromFile = (callback) => {
    fs.readFile(userFilePath, (err, data) => {
        if (err) {
            console.error('Erro ao ler users.json:', err);
            return callback([]);
        }
        callback(JSON.parse(data));
    });
};

// Função para escrever usuários no arquivo JSON
const writeUsersToFile = (users, callback) => {
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

    readUsersFromFile((users) => {
        const user = users.find(user => user.username === username && user.password === password);

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

    readUsersFromFile((users) => {
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

            writeUsersToFile(users, (err) => {
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
    readUsersFromFile((users) => {
        const user = users.find(u => u.id === req.user.id);
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
    });
});

// Endpoint para atualizar informações do usuário
router.post('/update-profile', authenticateToken, (req, res) => {
    const { username, email, address, phone, balance } = req.body;
    readUsersFromFile((users) => {
        const userIndex = users.findIndex(u => u.id === req.user.id);
        if (userIndex !== -1) {
            // Atualizar dados do usuário
            users[userIndex] = {
                ...users[userIndex],
                username,
                email,
                address,
                phone,
                balance
            };

            writeUsersToFile(users, (err) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'Erro ao atualizar usuário' });
                } else {
                    res.json({ success: true, user: users[userIndex] });
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
    });
});


module.exports = router;
