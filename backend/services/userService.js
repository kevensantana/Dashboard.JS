const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const SECRET_KEY = process.env.SECRET_KEY || 'seu-segredo-aqui';
const userFilePath = path.resolve(__dirname, '../db/data.json');

// Função para ler dados do arquivo JSON
const readData = (callback) => {
    fs.readFile(userFilePath, (err, data) => {
        if (err) {
            console.error('Erro ao ler data.json:', err);
            return callback([]);
        }
        callback(JSON.parse(data));
    });
};

// Função para escrever dados no arquivo JSON
const writeData = (data, callback) => {
    fs.writeFile(userFilePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Erro ao salvar data.json:', err);
            callback(err);
        } else {
            callback(null);
        }
    });
};

// Função para autenticar usuário
const authenticateUser = (username, password, callback) => {
    readData((data) => {
        const user = data.find(user => user.username === username && user.password === password);
        if (user) {
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            callback(null, token);
        } else {
            callback('Nome de usuário ou senha incorretos');
        }
    });
};

// Função para registrar um novo usuário
const registerUser = (username, email, password, callback) => {
    readData((data) => {
        const userExists = data.some(user => user.username === username || user.email === email);
        if (userExists) {
            callback('Usuário ou email já cadastrado');
        } else {
            const newUser = {
                id: uuidv4(),
                username,
                email,
                password,
                fixedExpenses: [],
                variableExpenses: [],
                savings: []
            };
            data.push(newUser);
            writeData(data, (err) => {
                if (err) {
                    callback('Erro ao salvar usuário');
                } else {
                    callback(null);
                }
            });
        }
    });
};

// Função para autenticar token JWT
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token de acesso não fornecido.' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido.' });
        req.user = user;
        next();
    });
};



module.exports = {
    authenticateUser,
    registerUser,
    authenticateToken
};
