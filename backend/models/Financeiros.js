const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    name: {type: String, default: "Não informado"},
    price: {type: Number, default: 0},
    installment: {type: String, default: "Não informado"},
    paymentDate: {type: String, default: "Não informado"},
    percentage: {type: Number, default: 0},
    date: { type: Date, default: Date.now },
});

const savingSchema = new Schema({
    name: {type: String, default: "Não informado"},
    amount: {type: Number, default: 0},
    date: { type: Date, default: Date.now },
});

const financialDataSchema = new Schema({
    // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    fixedExpenses: [expenseSchema],
    variableExpenses: [expenseSchema],
    savings: [savingSchema],
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Financeiros', financialDataSchema);