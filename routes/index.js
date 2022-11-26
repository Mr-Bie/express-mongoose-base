// Dependencies
const { body } = require("express-validator");

// Controllers
const controller = require("../app/controllers");

// Middlewares
const validationMiddleware = require("../app/middlewares/validateMiddleware");

// Schemas
const otpSchema = require("../app/schemas/otp/otpSchema");
const otpCheckSchema = require("../app/schemas/otp/otpCheckSchema");

module.exports = (app) => {
  app.get("/health", (req, res) => {
    res.status(222).send({
      result: "ok",
    });
  });

  app.post("/otp", validationMiddleware(otpSchema), controller.auth.otp);

  app.post(
    "/otp/check",
    validationMiddleware(otpCheckSchema),
    controller.auth.checkOtp
  );
};
