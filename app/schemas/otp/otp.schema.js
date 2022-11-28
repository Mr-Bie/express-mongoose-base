const { otp } = require("../../../config/auth");

const otpSchema = {
  type: "object",
  required: ["identifier"],
  properties: {
    identifier: {
      type: "string",
      oneOf: [{ format: "email" }, { pattern: "^\\+[1-9]{1}[0-9]{3,14}$" }],
    },
  },
  errorMessage: {
    properties: {
      identifier: "identifier field should be email or phone number",
    },
    required: {
      identifier: "identifier field is required",
    },
  },
};

module.exports = otpSchema;
