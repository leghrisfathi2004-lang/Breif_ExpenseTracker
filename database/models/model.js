const mongoose = require('mongoose');

//for user ----------
const transactionSchem = new mongoose.Schema({
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum:['income', 'expense'], default:"income" },
    categorie: { type: String},
    CreatedAt: { type: Date, default: Date.now}
});

const transaction = mongoose.model('transaction', transactionSchem);

module.exports = transaction;