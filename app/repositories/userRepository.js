const { User } = require("../models");

const findOne = async ({ id, email, phoneNumber }) => {
  return User.findOne({
    $or: [{ _id: id }, { email }, { phoneNumber }],
  });
};

const store = async (data) => {
  const user = new User({
    ...data,
    phoneNumber: data.phoneNumber,
    createdAt: new Date().getTime(),
  });

  await user.save();

  return user;
};

module.exports = {
  findOne,
  store,
};
