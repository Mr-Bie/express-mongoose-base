// Dependencies
const axios = require("axios");
const formData = require("form-data");

// Constrains
const GHASEDAK_API_KEY = process.env.GHASEDAK_API_KEY;

// Config
const LINE_NUMBER = "210002100";
const OTP_TEMPLATE = "Test";
const SINGLE_SMS_URL = "https://api.ghasedak.me/v2/sms/send/simple";
const MULTIPLE_SMS_URL = "https://api.ghasedak.me/v2/sms/send/pair";
const SINGLE_OTP_URL = "https://api.ghasedak.me/v2/verification/send/simple";

exports.send = (lineNumber, receptors, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const receptorsArray = Array.isArray(receptors) ? receptors : [receptors];
      const form = new formData();
      form.append("message", data);
      form.append("receptor", receptorsArray.shift());
      form.append("linenumber", LINE_NUMBER);
      const response = await axios.post(SINGLE_SMS_URL, form, {
        headers: {
          apikey: GHASEDAK_API_KEY.toString(),
        },
      });
      resolve(response);
    } catch (err) {
      reject(err);
    }
  });
};

exports.sendOTP = (receptor, data) => {
  return new Promise((resolve, reject) => {
    try {
      const receptorsArray = Array.isArray(receptor) ? receptor : [receptor];
      const dataArray = Array.isArray(data) ? data : [data];

      // FormData Creation
      const form = new formData();
      {
        dataArray.forEach((v, i) => {
          form.append(`param${i + 1}`, v);
        });
        form.append("receptor", receptorsArray.shift());
        form.append("type", 1);
        form.append("template", OTP_TEMPLATE);
      } // Append data to formData

      const response = axios.post(SINGLE_OTP_URL, form, {
        headers: {
          apikey: GHASEDAK_API_KEY.toString(),
        },
      });
      resolve(response);
    } catch (err) {
      reject(err);
    }
  });
};

exports.sendMultiple = (lineNumber, receptors, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const receptorsArray = Array.isArray(receptors) ? receptors : [receptors];
      const form = new formData();
      form.append("message", data);
      form.append("receptor", receptorsArray.join(","));
      form.append("linenumber", LINE_NUMBER);
      const response = await axios.post(MULTIPLE_SMS_URL, form, {
        headers: {
          apikey: GHASEDAK_API_KEY.toString(),
        },
      });
      resolve(response);
    } catch (err) {
      reject(err);
    }
  });
};
