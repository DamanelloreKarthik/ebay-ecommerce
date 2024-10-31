const express = require("express");
const router = express.Router();
const { createPayment } = require("./controller");

router.post("/createpayment", createPayment);

module.exports = router;
