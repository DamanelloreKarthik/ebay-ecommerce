const productModelSchema = require("./model");

// Product : Create

const createProduct = async (req, res) => {
  const { image, title, description, price, rating } = req.body;
  try {
    if (!image || !title || !description || !price || !rating) {
      return res.status(400).json({
        type: "error",
        message: "please provide all required to create the product",
      });
    }

    await productModelSchema.create({
      image,
      title,
      description,
      price,
      rating,
    });

    res.status(201).json({
      message: "product created successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Product: GET all products

const getAllProductsData = async (req, res) => {
  const products = await productModelSchema.find({});
  try {
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createProduct, getAllProductsData };
