const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProductsData,
  getIndividualProductDetails,
} = require("./controller");

router.post("/createproduct", createProduct);
router.get("/getallproducts", getAllProductsData);
router.get("/getproduct/:productId", getIndividualProductDetails);

module.exports = router;
