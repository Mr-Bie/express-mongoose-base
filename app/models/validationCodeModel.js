const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ValidationCode = mongoose.model(
  "ValidationCode",
  new mongoose.Schema(
    {
      user_id: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
        index: { unique: true },
      },
      code: { type: String, required: true },
      sent_at: { type: Date, required: false },
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
  )
);

module.exports = ValidationCode;
