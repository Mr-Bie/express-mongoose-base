const { User } = require("../models/index.model");

const findOne = async ({ id, email, phoneNumber, identifier }) => {
  return User.findOne({
    $or: [
      { _id: id },
      { email: email || identifier },
      { phoneNumber: phoneNumber || identifier },
    ],
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
