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

    // Map cart items to the expected format for Payment
    const cartData = cartItems.map((item) => ({
      productName: item.productDetails.title,
      quantity: item.quantity,
    }));

    // Save payment information to your database
    const paymentRecord = await Payment.create({
      userId,
      cartData,
      address,
      status: "Pending",
    });

    // Prepare the email content
    const emailContent = `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <p>User ID: ${userId}</p>
        <p>Shipping Address: ${address}</p>
        <h2>Cart Details:</h2>
        <ul>
          ${cartData
            .map(
              (item) =>
                `<li>${item.productName} - Quantity: ${item.quantity}</li>`
            )
            .join("")}
        </ul>
      `;

    // Send email to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Order Confirmation",
      html: emailContent,
    });

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
