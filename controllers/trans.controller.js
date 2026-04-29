const {transaction} = require('../database/models/model.js');
const {respond} = require('../middleware/respond.js');

const {calculBalance, calculTotal} = require('../services/calcul.js');

const addTransaction = async (req, res) =>{
    try{
        const { title, amount, type, categorie } = req.body;
        let newTrans;
        if(!type || type === 'income'){
            newTrans = new transaction({title, amount, type});
        } else {
            if(calculBalance(amount))
                newTrans = new transaction({title, amount, type, categorie});
            else
                return respond(res, 400, 'balance insufisant');
        }
        const saved = await newTrans.save();
        respond(res, 200, 'transaction created succefully');
    } catch(e) {
        respond(res, 500, e.message);
    }
}

const getByFilter = async (req, res) => {
    try {
        let filter = {};
        const { createdAt, categorie, type, startDate, endDate, page, limit } = req.query;

        if (categorie)  filter.categorie = categorie;
        if (type)       filter.type = type;

        if (createdAt) {
            filter.createdAt = new Date(createdAt);
        } else if (startDate && endDate) {
            filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const pageNum  = Math.max(1, parseInt(page)  || 1);
        const limitNum = Math.max(1, parseInt(limit) || 10);

        const data = await transaction.find(filter)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        respond(res, 200, 'filter & pagination done', data);

    } catch (e) {
        respond(res, 500, e.message);
    }
};

const getStatus = async (req, res) =>{
    try{
        const {month, year} = req.query;
        if(!month || !year)
            return respond(res, 400, 'required fields are missing');
        const trans = await transaction.find({createdAt: {$gte: new Date(year, month - 1, 1), $lte:new Date(year, month, 1)}});

        //separe par type
        const transIn = trans.filter(tr => tr.type === 'income');
        const transOut = trans.filter(tr => tr.type === 'expense');     

        //total foreach type
        const totalIn = calculTotal(transIn);
        const totalOut = calculTotal(transOut);

        //total foreach categorie in expense
        const ctgTotal = transOut.reduce((tab, el) => {
            tab[el.categorie] = (tab[el.categorie] || 0) + el.amount;
            return tab;
        }, {});

        //add percountage
        const resultat = Object.entries(ctgTotal).map(([categorie, total]) => ({
            categorie,
            total,
            percentage: ((total / totalOut) * 100).toFixed(2) + '%'
        }));
        const solde = totalIn - totalOut;

        respond(res, 200, 'status!', {solde, "total Income": totalIn, "total Expense": totalOut, "categories": resultat});
    } catch(e) {
        respond(res, 500, e.message);
    }
}

module.exports = {addTransaction, getByFilter, getStatus}