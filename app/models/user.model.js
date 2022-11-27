const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    lastName: String,
    phoneNumber: String,
    email: String,
    password: String,
    isCompleted: Boolean,
  })
);

module.exports = User;
