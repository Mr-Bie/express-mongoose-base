const { ValidationCode } = require("../models");

const store = async ({ userId, code }) => {
  const validationCode = new ValidationCode({
    user_id: userId,
    code,
    sent_at: new Date().getTime(),
  });

  await validationCode.save();

  return validationCode;
};

const findOne = async ({ userId }) => {
  return ValidationCode.findOne({ userId });
};

const update = async ({ userId, code }) => {
  const validationCode = await ValidationCode.findOne({ userId });
  validationCode.code = code;
  validationCode.sent_at = new Date().getTime();
  await validationCode.save();
  return validationCode;
};

module.exports = {
  store,
  findOne,
  update,
};
