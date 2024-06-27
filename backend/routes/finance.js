const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const financeFilePath = path.resolve(__dirname, '../db/data.json');

// Função auxiliar para ler os dados do JSON
const readData = () => {
    const data = fs.readFileSync(financeFilePath, 'utf8');
    return JSON.parse(data);
};

// Função auxiliar para escrever os dados no JSON
const writeData = (data) => {
    fs.writeFileSync(financeFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Endpoint para buscar o arquivo JSON Data
router.get('/dados', (req, res) => {
    fs.readFile(financeFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler data.json:', err);
            res.status(500).json({ message: 'Erro ao ler data.json' });
            return;
        }
        res.json(JSON.parse(data));
    });
});

// ================================
// ROTA PARA ADICIONAR DESPESA
// ================================

router.post('/addExpense', (req, res) => {
    try {
        console.log('Corpo da requisição (addExpense):', req.body);

        const { expenseType, name = '', date = '', price = '', installment = '', paymentDate = '', percentage = '' } = req.body;

        const newExpense = {
            id: Date.now().toString(),
            name,
            date,
            price,
            installment,
            paymentDate,
            percentage
        };

        const data = readData();
        const user = data[0]; // Supondo que estamos lidando com o primeiro usuário

        // Verificar o tipo de despesa (fixa ou variável)
        if (expenseType === 'fixed') {
            user.fixedExpenses.push(newExpense);
        } else if (expenseType === 'variable') {
            user.variableExpenses.push(newExpense);
        } else {
            return res.status(400).json({ message: 'Tipo de despesa inválido' });
        }

        writeData(data);
        res.json({ message: 'Despesa adicionada com sucesso' });
    } catch (error) {
        console.error('Erro ao adicionar despesa:', error);
        res.status(500).json({ message: 'Erro ao adicionar despesa' });
    }
});

// ================================
// ROTA PARA ADICIONAR ECONOMIA
// ================================

router.post('/addSavings', (req, res) => {
    try {
        console.log('Corpo da requisição (addSavings):', req.body);

        const { name = '', amount = '', date = '' } = req.body;

        const newSaving = {
            id: Date.now().toString(),
            name,
            amount,
            date
        };

        const data = readData();
        const user = data[0]; // Supondo que estamos lidando com o primeiro usuário

        user.savings.push(newSaving);

        writeData(data);
        res.json({ message: 'Economia adicionada com sucesso' });
    } catch (error) {
        console.error('Erro ao adicionar economia:', error);
        res.status(500).json({ message: 'Erro ao adicionar economia' });
    }
});

// ================================
// ROTA PARA EXCLUIR DESPESA
// ================================

router.delete('/deleteExpense', (req, res) => {
    try {
        console.log('Corpo da requisição (deleteExpense):', req.body);

        const { expenseId, expenseType } = req.body;

        const data = readData();
        const user = data[0]; // Supondo que estamos lidando com o primeiro usuário

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (expenseType === 'fixed') {
            user.fixedExpenses = user.fixedExpenses.filter(expense => expense.id !== expenseId);
        } else if (expenseType === 'variable') {
            user.variableExpenses = user.variableExpenses.filter(expense => expense.id !== expenseId);
        } else {
            return res.status(400).json({ message: 'Tipo de despesa inválido' });
        }

        writeData(data);
        res.status(200).json({ message: 'Despesa excluída com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir despesa:', error);
        res.status(500).json({ message: 'Erro ao excluir despesa' });
    }
});

module.exports = router;
