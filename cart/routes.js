const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCartProducts,
  updateCartProduct,
  deleteCartProduct,
} = require("./controller");

router.post("/addtocart", addToCart);
router.get("/getcartproducts", getCartProducts);
router.put("/updatecart", updateCartProduct);
router.delete("/deletecartproduct", deleteCartProduct);

module.exports = router;
