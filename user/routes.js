const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("./controller");
router.post("/registeruser", registerUser);
router.post("/loginuser", loginUser);

module.exports = router;
