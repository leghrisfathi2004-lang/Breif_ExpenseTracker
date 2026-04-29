const express = require('express');
const router = express.Router();

const {validate} = require("../middleware/validator.js");
const {addTransaction, getByFilter, getStatus} = require('../controllers/trans.controller.js');


//crud user
router.post("/transaction", validate, addTransaction);
router.get("/transaction", getByFilter);
router.get("/transaction/status", getStatus);

module.exports = router;