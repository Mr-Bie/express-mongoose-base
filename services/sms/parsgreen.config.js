// Dependencies
const axios = require("axios");

// Constrains
const PARS_GREEN_API_KEY = process.env.PARS_GREEN_API_KEY;
// Config
const PARS_GREEN_SINGLE_SMS = "http://sms.parsgreen.ir/Apiv2/Message/SendSms";
const PARS_GREEN_SINGLE_OTP = "http://sms.parsgreen.ir/Apiv2/Message/SendOtp";
const OTP_TEMPLATE = "Test";

getSenders = async () =>
  await axios.post(
    "http://sms.parsgreen.ir/Apiv2/User/SmsNumber",
    { NumberType: 0 },
    {
      headers: {
        Authorization: "basic apikey:88F746EF-C8B5-4B2C-A6CF-7A4E87D05495",
      },
    }
  );

exports.send = (sender, receptors, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const receptorsArray = Array.isArray(receptors) ? receptors : [receptors];
      const response = await axios.post(
        PARS_GREEN_SINGLE_SMS,
        {
          SmsBody: data,
          Mobiles: receptorsArray,
          SmsNumber: sender,
        },
        {
          headers: {
            Authorization: `basic apikey:${PARS_GREEN_API_KEY}`,
          },
        }
      );
      resolve(response);
    } catch (err) {
      reject(err);
    }
  });
};

exports.sendOTP = (receptor, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const receptorsArray = Array.isArray(receptor) ? receptor : [receptor];
      const dataArray = Array.isArray(data) ? data : [data];

      const response = await axios.post(
        PARS_GREEN_SINGLE_OTP,
        {
          SmsCode: dataArray.shift(),
          Mobile: receptorsArray.shift(),
          TemplateID: OTP_TEMPLATE,
        },
        {
          headers: {
            Authorization: `basic apikey:${PARS_GREEN_API_KEY}`,
          },
        }
      );
      resolve(response);
    } catch (err) {
      reject(err);
    }
  });
};
