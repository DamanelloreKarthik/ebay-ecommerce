const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// user model schema comment added

const UserModelSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: false,
  },
});

const userModelSchema = mongoose.model("user", UserModelSchema);

module.exports = userModelSchema;
