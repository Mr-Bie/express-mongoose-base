// Dependencies
const axios = require("axios");

// Config
const PARS_GREEN_SINGLE_SMS = 'http://sms.parsgreen.ir/Apiv2/Message/SendSms';
const PARS_GREEN_SINGLE_OTP = 'http://sms.parsgreen.ir/Apiv2/Message/SendOtp';

exports.send = (apiKey, sender, receptors, data) => {
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
            Authorization: `basic apikey:${apiKey}`,
          },
        },
      );
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
};

exports.sendOTP = (apiKey, receptor, data, otpTemplate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const receptorsArray = Array.isArray(receptor) ? receptor : [receptor];
      const dataArray = Array.isArray(data) ? data : [data];

      const response = await axios.post(
        PARS_GREEN_SINGLE_OTP,
        {
          SmsCode: dataArray.shift(),
          Mobile: receptorsArray.shift(),
          TemplateID: otpTemplate,
        },
        {
          headers: {
            Authorization: `basic apikey:${apiKey}`,
          },
        },
      );
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
};
