const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductModelSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  productId: {
    type: String,
    required: false,
  },
});

const productModelSchema = mongoose.model("product", ProductModelSchema);
module.exports = productModelSchema;
