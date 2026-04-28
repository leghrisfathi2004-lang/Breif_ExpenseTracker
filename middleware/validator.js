const joi = require ('joi');

const validate = (schema) => (req, res, next) => {
    const transactionSchema = joi.object({
        title: joi.string().trim().required(),
        amount: joi.number().positive().required(),
        type: joi.string().valid('income', 'expense').required(),
        categorie: joi.string().trim().when('type', {
            is: "expense",
            then: joi.required(),
            otherwise: joi.optional()
        })
    });
    const { error } = schema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0].message });
    next();
};



module.exports = {validate};