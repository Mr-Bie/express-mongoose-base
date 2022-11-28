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
      identifier: "identifier field should be email or phone number",
      otp: "otp field is invalid",
    },
    required: {
      identifier: "identifier is required",
      otp: "otp is required",
    },
  },
};

module.exports = otpCheckSchema;
