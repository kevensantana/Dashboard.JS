// backend/financeiro.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = 'seu-segredo-aqui'; // Chave secreta para o JWT

// Função para ler dados de orçamento do arquivo JSON
const readBudgetData = (callback) => {
    const budgetFilePath = path.resolve(__dirname, '../db/budgets.json');
    fs.readFile(budgetFilePath, (err, data) => {
        if (err) {
            console.error('Erro ao ler budgets.json:', err);
            return callback([]);
        }
        callback(JSON.parse(data));
    });
};

// Função para escrever dados de orçamento no arquivo JSON
const writeBudgetData = (budgets, callback) => {
    const budgetFilePath = path.resolve(__dirname, '../db/budgets.json');
    fs.writeFile(budgetFilePath, JSON.stringify(budgets, null, 2), (err) => {
        if (err) {
            console.error('Erro ao salvar budgets.json:', err);
            callback(err);
        } else {
            callback(null);
        }
    });
};

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

// Endpoint para obter dados de orçamento do usuário atual
router.get('/finance', authenticateToken, (req, res) => {
    readBudgetData((budgets) => {
        const userBudgets = budgets.filter(budget => budget.userId === req.user.id);
        res.json(userBudgets);
    });
});

// Endpoint para adicionar dados de orçamento para o usuário atual
router.post('/finance', authenticateToken, (req, res) => {
    const { income, expenses } = req.body;

    const newBudget = {
        id: uuidv4(),
        userId: req.user.id,
        income,
        expenses,
        createdAt: new Date().toISOString()
    };

    readBudgetData((budgets) => {
        budgets.push(newBudget);

        writeBudgetData(budgets, (err) => {
            if (err) {
                res.status(500).json({ success: false, message: 'Erro ao salvar orçamento' });
            } else {
                res.json({ success: true, budget: newBudget });
            }
        });
    });
});

module.exports = router;
