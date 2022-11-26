// Dependencies
const Kavenegar = require("kavenegar");

// Constrains
const KAVENEGAR_API_KEY = process.env.KAVENEGAR_API_KEY;

// Config
const OTP_TEMPLATE = "Test";

let api = Kavenegar.KavenegarApi({
  apikey: KAVENEGAR_API_KEY,
});

exports.send = (sender, receptors, data) => {
  return new Promise((resolve, reject) => {
    const receptorsArray = Array.isArray(receptors) ? receptors : [receptors];
    api.Send(
      {
        receptor: receptorsArray.join(","),
        message: data,
        sender,
      },
      function (response, status) {
        if (status === 200) resolve(JSON.stringify(response));
        else {
          console.log(`error in sending sms : ${response}`);
          reject(new Error(status));
        }
      }
    );
  });
};

exports.sendOTP = (receptor, data) => {
  return new Promise((resolve, reject) => {
    const receptorsArray = Array.isArray(receptor) ? receptor : [receptor];
    const dataArray = Array.isArray(data) ? data : [data];

    api.VerifyLookup(
      {
        receptor: receptorsArray.shift(),
        token: dataArray.shift(),
        template: OTP_TEMPLATE,
      },
      function (response, status) {
        if (status === 200) resolve(JSON.stringify(response));
        else {
          console.log(`error in sending sms : ${response}`);
          reject(new Error(status));
        }
      }
    );
  });
};
