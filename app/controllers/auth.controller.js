// Dependencies
const jwt = require("jsonwebtoken");

// Repositories
const {
  validationCodeRepository,
  userRepository,
} = require("../repositories/index.repository");

// Services
const EmailService = require("../../services/email.service");
const SmsService = require("../../services/sms/sms.service");

// Constrains
const { otp: otpConfig, token: tokenConfig } = require("../../config/auth");
const otpLength = otpConfig.length;
const otpExpireTime = otpConfig.expiredTime;

// Validators
const isEmail = require("../validators/isEmail");

const otp = async (req, res, next) => {
  const { identifier } = req.body;
  const identifierType = (await isEmail(req.body.identifier))
    ? "email"
    : "phoneNumber";
  let user = await userRepository.findOne({ identifier });

  if (!user) {
    const data =
      identifierType === "email"
        ? { email: identifier }
        : { phoneNumber: identifier };
    user = await userRepository.store(data);
  }

  const userId = user._id;

  let validationCode = await validationCodeRepository.findOne(userId);
  const newOtpCode = otpGenerator();
  if (!validationCode) {
    validationCode = await validationCodeRepository.store({
      userId,
      code: newOtpCode,
    });
    try {
      identifierType === "email"
        ? await EmailService.sendEmail(
            req.t("auth:otp.send_subject"),
            req.t("auth:otp.send_message_pattern") + validationCode.code,
            [user.email]
          )
        : await SmsService.sendOTP(
            user.phoneNumber,
            req.t("auth:otp.send_message_pattern") + validationCode.code
          );
    } catch (err) {
      next(err);
    }
    return res.success({
      message: req.t("auth:otp.success"),
      status: 200,
    });
  }

  if (new Date() - new Date(validationCode.sent_at) < otpExpireTime)
    return res.error({
      message: req.t("auth:otp.failed.otp_not_expired"),
      status: 400,
    });

  validationCode = await validationCodeRepository.update({
    user_id: req.body.userId,
    code: newOtpCode,
  });

  try {
    identifierType === "email"
      ? await EmailService.sendEmail(
          req.t("auth:otp.send_subject"),
          req.t("auth:otp.send_message_pattern") + validationCode.code,
          [user.email]
        )
      : await SmsService.sendOTP(
          user.phoneNumber,
          req.t("auth:otp.send_message_pattern") + validationCode.code
        );
  } catch (err) {
    next(err);
  }

  res.success({ message: req.t("auth:otp.success"), status: 200 });
};

const checkOtp = async (req, res, next) => {
  const { identifier, otp: otpCode } = req.body;
  let user = await userRepository.findOne({ email: identifier });

  if (!user)
    return res.error({
      message: req.t("namespace:user_not_found"),
      status: 400,
    });

  const userId = user._id;

  let validationCode = await validationCodeRepository.findOne(userId);

  if (!validationCode)
    return res.error({
      message: req.t("auth:check_otp.failed.otp_invalid"),
      status: 400,
    });

  if (new Date() - new Date(validationCode.sent_at) > otpExpireTime)
    return res.error({
      message: req.t("auth:check_otp.failed.otp_expired"),
      status: 400,
    });

  if (validationCode.code !== otpCode)
    return res.error({
      message: req.t("auth:check_otp.failed.otp_invalid"),
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
    message: req.t("auth:check_otp.success"),
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
