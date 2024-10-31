const userModelSchema = require("./model");
const bcrypt = require("bcrypt");

// User: Registration

const registerUser = async (req, res) => {
  const { email, password, username, phone, city } = req.body;

  const requiredFields = { email, password, username, phone, city };
  try {
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          type: "error",
          message: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } field is missing`,
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModelSchema.create({
      email,
      password: hashedPassword,
      username,
      phone,
      city,
    });
    res.status(201).json({
      message: "we have registered successfully. please login to continue",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// User: Login

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // check if email is not provided

    if (!email) {
      return res.status(400).json({
        type: "error",
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        type: "error",
        message: "Password is required",
      });
    }

    // Find the user by email

    const user = await userModelSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({
        type: "error",
        message: "User is not registered with these email",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        type: "error",
        message: "Invalid password",
      });
    }

    // Exclude the password from the user data

    const { password: _, ...userData } = user.toObject();

    // Send user data in response

    res.status(200).json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
