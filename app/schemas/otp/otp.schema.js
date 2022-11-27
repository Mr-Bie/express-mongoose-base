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
      identifier: "VALIDATION_OTP_IDENTIFIER_INVALID",
    },
    required: {
      identifier: "VALIDATION_OTP_IDENTIFIER_REQUIRED",
    },
  },
};

module.exports = otpSchema;
