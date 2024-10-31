const express = require("express");
const router = express.Router();

const { createProduct, getAllProductsData } = require("./controller");

router.post("/createproduct", createProduct);
router.get("/getallproducts", getAllProductsData);

module.exports = router;
