// backend/financeiro.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const financeFilePath = path.resolve(__dirname, '../db/data.json');


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


module.exports = router;