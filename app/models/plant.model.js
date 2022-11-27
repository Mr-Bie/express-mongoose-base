const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    images: [{ type: Schema.Types.String }],
    phoneNumber: String,
    email: String,
    password: String,
    plants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Plant",
      },
    ],
  })
);

module.exports = User;
