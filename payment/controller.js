const nodemailer = require("nodemailer");
const Payment = require("../payment/model");
const Cart = require("../cart/model");
const User = require("../user/model");

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Payment: Create a payment
const createPayment = async (req, res) => {
  const { userId, address } = req.body;

  try {
    // Validate request body
    if (!userId || !address) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Fetch cart data for the user
    const cartItems = await Cart.find({ userId });

    // Check if cart is empty
    if (cartItems.length === 0) {
      return res.status(400).json({ error: "No items in cart." });
    }

    // Fetch user details to get the email
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Calculate total price and validate product data
    let totalPrice = 0;
    const cartData = cartItems.map((item) => {
      // Check if productDetails and product name exist
      const productName = item?.productDetails?.title;
      const productPrice = Number(item?.productDetails?.price);

      if (!productName) {
        throw new Error("Missing product name in cart item.");
      }
      if (isNaN(productPrice)) {
        throw new Error("Invalid product price in cart item.");
      }

      const itemTotal = productPrice * Number(item.quantity);
      totalPrice += itemTotal;

      return {
        productName,
        quantity: Number(item.quantity),
      };
    });

    // Save payment information to your database
    const paymentRecord = await Payment.create({
      userId,
      cartData,
      address,
      totalPrice,
      status: "Pending",
    });

    // Prepare the email content
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; padding-bottom: 20px;">
        <img src="https://pic.surf/zd" alt="Company Logo" style="width: 150px;">
      </div>
      <h1 style="color: #333; text-align: center; font-size: 24px;">Order Confirmation</h1>
      <p style="font-size: 16px; color: #666; text-align: center; margin-bottom: 20px;">Thank you for your order!</p>
      <div style="border-top: 1px solid #eee; margin: 20px 0;"></div>
  
      <h3 style="color: #333; font-size: 18px;">Shipping Details</h3>
      <p style="font-size: 16px; color: #666; line-height: 1.5;">
        <strong>User ID:</strong> ${userId}<br>
        <strong>Shipping Address:</strong> ${address}
      </p>
  
      <h3 style="color: #333; font-size: 18px;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #555;">Product</th>
            <th style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #555;">Quantity</th>
            <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #555;">Price</th>
            <th style="text-align: center; padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; color: #555;">Image</th>
          </tr>
        </thead>
        <tbody>
          ${cartItems
            .map(
              (item) => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #f5f5f5;">${
                  item.productDetails.title
                }</td>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #f5f5f5;">${
                  item.quantity
                }</td>
                <td style="padding: 8px; text-align: right; border-bottom: 1px solid #f5f5f5;">$${(
                  Number(item.productDetails.price) * Number(item.quantity)
                ).toFixed(2)}</td>
                <td style="padding: 8px; text-align: center; border-bottom: 1px solid #f5f5f5;">
                  <img src="${item.productDetails.image}" alt="${
                item.productDetails.title
              }" style="width: 50px; height: auto;">
                </td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
  
      <h2 style="text-align: right; color: #333; font-size: 20px; margin-top: 10px;">Total: $${Number(
        totalPrice.toFixed(2)
      )}</h2>
  
      <div style="border-top: 1px solid #eee; margin: 20px 0;"></div>
  
      <p style="font-size: 16px; color: #666; text-align: center; margin-top: 20px;">
        Need help? <a href="mailto:damanellorekarthik@gmail.com" style="color: #007bff; text-decoration: underline;">Contact Support</a>
      </p>
    </div>
  `;

    // Send email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Order Confirmation",
      html: emailContent,
    });

    // Clear the user's cart after creating the payment
    await Cart.deleteMany({ userId });

    res.status(200).json({
      message:
        "Order created successfully. A confirmation email has been sent.",
      paymentRecord,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your order." });
  }
};

module.exports = { createPayment };
