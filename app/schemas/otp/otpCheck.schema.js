const { otp } = require("../../../config/auth");
const otpCheckSchema = {
  type: "object",
  required: ["identifier", "otp"],
  properties: {
    identifier: {
      type: "string",
      oneOf: [{ format: "email" }, { pattern: "^\\+[1-9]{1}[0-9]{3,14}$" }],
    },
    otp: {
      type: "string",
      maxLength: otp.length,
      minLength: otp.length,
    },
  },
  errorMessage: {
    properties: {
      identifier: "VALIDATION_OTP_IDENTIFIER_INVALID",
      otp: "VALIDATION_OTP_OTP_INVALID",
    },
    required: {
      identifier: "VALIDATION_OTP_IDENTIFIER_REQUIRED",
      otp: "VALIDATION_OTP_OTP_REQUIRED",
    },
  },
};

module.exports = otpCheckSchema;
