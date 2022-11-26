// Dependencies
const jwt = require("jsonwebtoken");

// Repositories
const { validationCodeRepository, userRepository } = require("../repositories");

// Services
const EmailService = require("../../services/EmailProvider");

// Constrains
const { otp: otpConfig, token: tokenConfig } = require("../../config/auth");
const otpLength = otpConfig.length;
const otpExpireTime = otpConfig.expiredTime;

const otp = async (req, res, next) => {
  const { identifier } = req.body;
  let user = await userRepository.findOne({ email: identifier });

  console.log();
  if (!user)
    return res.error({
      message: req.t("email.otp.failed.user_not_found", { ns: "auth" }),
      status: 400,
    });

  const userId = user._id;

  let validationCode = await validationCodeRepository.findOne(userId);
  const newOtpCode = otpGenerator();
  if (!validationCode) {
    validationCode = await validationCodeRepository.store({
      userId,
      code: newOtpCode,
    });
    try {
      await EmailService.sendEmail(
        req.t("EMAIL_OTP_SUBJECT"),
        req.t("EMAIL_OTP_MESSAGE") + validationCode.code,
        [user.email]
      );
    } catch (err) {
      console.log(err);
      return res.error({
        message: req.t("ERROR_EMAIL_NOT_SENT"),
        status: 500,
      });
    }
    return res.success({
      message: req.t("NEW_OTP_SENT_RESPONSE"),
      status: 200,
    });
  }

  if (new Date() - new Date(validationCode.sent_at) < otpExpireTime)
    return res.error({ message: req.t("ERROR_OTP_NOT_EXPIRED"), status: 400 });

  validationCode = await validationCodeRepository.update({
    user_id: req.body.userId,
    code: newOtpCode,
  });

  try {
    await EmailService.sendEmail(
      req.t("EMAIL_OTP_SUBJECT"),
      req.t("EMAIL_OTP_MESSAGE") + validationCode.code,
      [user.email]
    );
  } catch (err) {
    console.log(err);
    return res.error({
      message: req.t("ERROR_EMAIL_NOT_SENT"),
      status: 500,
    });
  }

  res.success({ message: req.t("NEW_OTP_SENT_RESPONSE"), status: 200 });
};

const checkOtp = async (req, res, next) => {
  const { identifier, otp: otpCode } = req.body;
  let user = await userRepository.findOne({ email: identifier });

  if (!user)
    return res.error({ message: req.t("ERROR_USER_NOT_FOUND"), status: 400 });

  const userId = user._id;

  let validationCode = await validationCodeRepository.findOne(userId);

  if (!validationCode)
    return res.error({
      message: req.t("VALIDATION_OTP_OTP_INVALID"),
      status: 400,
    });

  if (new Date() - new Date(validationCode.sent_at) > otpExpireTime)
    return res.error({ message: req.t("ERROR_OTP_EXPIRED"), status: 400 });

  if (validationCode.code !== otpCode)
    return res.error({
      message: req.t("VALIDATION_OTP_OTP_INVALID"),
      status: 400,
    });

  const token = await jwt.sign(
    { key: validationCode.userId },
    process.env.SECRET_KEY,
    {
      expiresIn: tokenConfig.expirationTime,
    }
  );

  res.success({
    data: { token },
    message: req.t("LOGIN_SUCCESS"),
    status: 200,
  });
};

const otpGenerator = () => {
  const otpSize = otpLength;
  let validationCode = "";
  for (let i = 0; i < otpSize; i++)
    validationCode += Math.floor(Math.random() * 10).toString();

  return validationCode;
};

module.exports = {
  otp,
  checkOtp,
};
