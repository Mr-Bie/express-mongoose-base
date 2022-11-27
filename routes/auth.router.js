const validationMiddleware = require("../app/middlewares/validate.middleware");
const router = require("express").Router();
const otpSchema = require("../app/schemas/otp/otp.schema");
const controller = require("../app/controllers/index.controller");
const otpCheckSchema = require("../app/schemas/otp/otpCheck.schema");

router.post("/otp", validationMiddleware(otpSchema), controller.auth.otp);

router.post(
  "/otp/check",
  validationMiddleware(otpCheckSchema),
  controller.auth.checkOtp
);

module.exports = router;
