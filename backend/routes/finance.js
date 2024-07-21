const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Financeiros.js');
const FinanceiroData = mongoose.model('Financeiros');

router.get('/dataFinance', (req, res) => {
    FinanceiroData.find().then((financeiros) => {
        res.json(financeiros);
    }).catch((err) => {
        console.log(err);
    });
});


router.post('/addExpense', (req, res) => {
    const newFinanceiroData = {
        fixedExpenses: req.body.fixedExpenses,
        variableExpenses: req.body.variableExpenses,
    };

    new FinanceiroData(newFinanceiroData).save().then(() => {
        console.log("Dados financeiros salvos com sucesso!");
    }).catch((err) => {
        console.log(err);
    });
});

router.post('/addSavings', (req, res) => {
    const newFinanceiroData = {
        savings: req.body.savings,
    };

    new FinanceiroData(newFinanceiroData).save().then(() => {
        console.log("Dados financeiros salvos com sucesso!");
    }).catch((err) => {
        console.log(err);
    });
});



module.exports = router;

