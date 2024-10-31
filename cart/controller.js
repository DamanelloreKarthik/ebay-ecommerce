const cartSchema = require("./model");
const productSchema = require("../product/model");
const userModelSchema = require("../user/model");

// Cart: Add product to cart

const addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    if (!userId) {
      return res.status(400).json({
        type: "error",
        message: "need user id",
      });
    }

    if (!productId) {
      return res.status(400).json({
        type: "error",
        message: "need product id",
      });
    }

    if (!quantity) {
      return res.status(400).json({
        type: "error",
        message: "quantity is required",
      });
    }

    // find the product details using the productId
    const product = await productSchema.findById(productId);

    if (!product) {
      return res.status(404).json({
        type: "error",
        message: "Product not found",
      });
    }

    // find the user by their id

    const user = await userModelSchema.findById(userId);

    if (!user) {
      return res.status(404).json({
        type: "error",
        message: "User is not found",
      });
    }

    // create a new cart item with full product details and quantity
    const cartItem = await cartSchema.create({
      userId,
      productId,
      quantity,
      productDetails: {
        image: product.image,
        title: product.title,
        description: product.description,
        price: product.price,
        rating: product.rating,
      },
    });

    res.status(200).json({
      message: "product added to cart successfully",
      cartItem,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cart: get products in cart by user id

const getCartProducts = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({
        type: "error",
        message: "User ID is required",
      });
    }

    // Check if user exists
    const user = await userModelSchema.findById(userId);
    if (!user) {
      return res.status(404).json({
        type: "error",
        message: "User not found",
      });
    }

    // Find cart items for the user
    const cartItems = await cartSchema.find({ userId });

    if (cartItems.length === 0) {
      return res.status(404).json({
        type: "error",
        message: "No products found in cart",
      });
    }

    res.status(200).json({
      message: "Cart products retrieved successfully",
      cartItems,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cart:update cart item

const updateCartProduct = async (req, res) => {
  const { cartItemId, quantity } = req.body;
  try {
    if (!cartItemId) {
      return res.status(400).json({
        type: "error",
        message: "Cart item ID is required",
      });
    }

    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        type: "error",
        message: "Quantity must be a positive number",
      });
    }

    // Update the cart item quantity
    const updatedCartItem = await cartSchema.findByIdAndUpdate(
      cartItemId,
      { quantity },
      { new: true }
    );

    if (!updatedCartItem) {
      return res.status(404).json({
        type: "error",
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      message: "Cart item updated successfully",
      updatedCartItem,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Cart: Delete product from cart
const deleteCartProduct = async (req, res) => {
  const { cartItemId } = req.body;

  try {
    if (!cartItemId) {
      return res.status(400).json({
        type: "error",
        message: "Cart item ID is required",
      });
    }

    // Find and delete the cart item
    const deletedCartItem = await cartSchema.findByIdAndDelete(cartItemId);

    if (!deletedCartItem) {
      return res.status(404).json({
        type: "error",
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      message: "Cart item deleted successfully",
      deletedCartItem,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  addToCart,
  getCartProducts,
  updateCartProduct,
  deleteCartProduct,
};
