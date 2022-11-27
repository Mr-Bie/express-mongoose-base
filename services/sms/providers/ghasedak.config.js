// Dependencies
const axios = require("axios");
const formData = require("form-data");

// Config
const SINGLE_SMS_URL = "https://api.ghasedak.me/v2/sms/send/simple";
const MULTIPLE_SMS_URL = "https://api.ghasedak.me/v2/sms/send/pair";
const SINGLE_OTP_URL = "https://api.ghasedak.me/v2/verification/send/simple";

exports.send = (apiKey, lineNumber, receptors, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const receptorsArray = Array.isArray(receptors) ? receptors : [receptors];
      const form = new formData();
      form.append("message", data);
      form.append("receptor", receptorsArray.shift());
      form.append("linenumber", lineNumber);
      const response = await axios.post(SINGLE_SMS_URL, form, {
        headers: {
          apikey: apiKey.toString(),
        },
      });
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

      // FormData Creation
      const form = new formData();
      {
        dataArray.forEach((v, i) => {
          form.append(`param${i + 1}`, v);
        });
        form.append("receptor", receptorsArray.shift());
        form.append("type", 1);
        form.append("template", otpTemplate);
      } // Append data to formData

      const response = await axios.post(SINGLE_OTP_URL, form, {
        headers: {
          apikey: apiKey.toString(),
        },
      });
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
};

exports.sendMultiple = (apiKey, lineNumber, receptors, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const receptorsArray = Array.isArray(receptors) ? receptors : [receptors];
      const form = new formData();
      form.append("message", data);
      form.append("receptor", receptorsArray.join(","));
      form.append("linenumber", lineNumber);
      const response = await axios.post(MULTIPLE_SMS_URL, form, {
        headers: {
          apikey: apiKey.toString(),
        },
      });
      resolve(response.data);
    } catch (err) {
      reject(err);
    }
  });
};
