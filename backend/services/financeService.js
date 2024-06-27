const fs = require('fs');
const path = require('path');

const financeFilePath = path.resolve(__dirname, '../db/data.json');

// Função para ler dados financeiros do arquivo JSON
const readFinanceData = (callback) => {
    fs.readFile(financeFilePath, (err, data) => {
        if (err) {
            console.error('Erro ao ler data.json:', err);
            return callback([]);
        }
        callback(JSON.parse(data));
    });
};

// Função para escrever dados financeiros no arquivo JSON
const writeFinanceData = (financeData, callback) => {
    fs.writeFile(financeFilePath, JSON.stringify(financeData, null, 2), (err) => {
        if (err) {
            console.error('Erro ao salvar data.json:', err);
            callback(err);
        } else {
            callback(null);
        }
    });
};

// Função para obter dados financeiros do usuário
const getUserFinanceData = (userId, callback) => {
    readFinanceData((financeData) => {
        const userFinanceData = financeData.find(data => data.id === userId);
        if (userFinanceData) {
            callback(null, userFinanceData);
        } else {
            callback('Dados financeiros não encontrados para este usuário');
        }
    });
};

// Função para atualizar dados financeiros do usuário
const updateUserFinanceData = (userId, newFinanceData, callback) => {
    readFinanceData((financeData) => {
        const userIndex = financeData.findIndex(data => data.id === userId);
        if (userIndex !== -1) {
            financeData[userIndex] = newFinanceData;
            writeFinanceData(financeData, (err) => {
                if (err) {
                    callback('Erro ao salvar dados financeiros');
                } else {
                    callback(null);
                }
            });
        } else {
            callback('Dados financeiros não encontrados para este usuário');
        }
    });
};


module.exports = {
    getUserFinanceData,
    updateUserFinanceData
};
