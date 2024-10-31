const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./user/routes");
const productRoutes = require("./product/routes");
const cartRoutes = require("./cart/routes");
const paymentRoutes = require("./payment/routes");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

// swagger

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// cors
app.use(cors());

// view the https request handling
app.use((req, res, next) => {
  console.log("path" + req.path + "method" + req.method);
  next();
});

// body parser
app.use(bodyParser.json());

// DB Connection

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        "DB connected successfully and listening to " + process.env.PORT
      );
    });
  })
  .catch((error) => console.log(error));

// routes

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
