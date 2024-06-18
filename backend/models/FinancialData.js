const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    name: String,
    date: String,
    price: Number,
    installment: String,
    paymentDate: String,
    percentage: Number
});

const savingSchema = new mongoose.Schema({
    name: String,
    date: String,
    price: Number,
    goal: Number,
    remaining: Number
});

const financialDataSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fixedExpenses: [expenseSchema],
    variableExpenses: [expenseSchema],
    savings: [savingSchema]
});

module.exports = mongoose.model('FinancialData', financialDataSchema);
