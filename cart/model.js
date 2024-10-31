const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  productDetails: {
    type: Object,
    required: true,
  },
  cartItemId: {
    type: String,
    required: false,
  },
});

const cartSchema = mongoose.model("cart", CartSchema);
module.exports = cartSchema;
