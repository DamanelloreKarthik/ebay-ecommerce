const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "ebay-ecommerce",
    description:
      "ebay-ecommerce- doubts send query damanellorekarthik@gmail.com",
  },
  host: "https://ebay-ecommerce.onrender.com/",
  schemes: ["https"],
};

const outputFile = "./swagger-output.json";
const routes = ["./index.js"];

swaggerAutogen(outputFile, routes, doc).then(() => {
  require("./index.js");
});
