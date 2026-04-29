
const {respond} = require('../middleware/respond.js');
const {transaction} = require('../database/models/model.js');

const calculBalance = async (amount) => {
    try{
        const transactions = await Transaction.find();
        const balance = transactions.reduce((acc, tran) => {
            return tran.type === 'income' ? acc + tran.amount : acc - tran.amount;
        }, 0);
        return balance >= amount;
    } catch(e) {
        respond(res, 500, e.message);
    }
}

const calculTotal = (tab) => {
    try{
        return tab.reduce((total, el) => total + el.amount, 0)
    } catch(e) {
        respond(res, 500, e.message);
    }
}

module.exports = {calculBalance, calculTotal};