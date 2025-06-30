const express = require("express");
const router = express.Router();
const authorization = require("../utils/authtransaction")
const controller = require("../Controllers/transaction")

router.post("/add"/*,authorization.authtransaction*/,controller.createtransaction);
router.get("/daily", controller.getDailyTransactions);

module.exports = router;