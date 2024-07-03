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


module.exports = router;

