// Dependencies
const Kavenegar = require('kavenegar');

exports.send = (apiKey, sender, receptors, data) => {
  return new Promise((resolve, reject) => {
    const api = Kavenegar.KavenegarApi({
      apikey: apiKey,
    });
    const receptorsArray = Array.isArray(receptors) ? receptors : [receptors];
    api.Send(
      {
        receptor: receptorsArray.join(','),
        message: data,
        sender,
      },
      function (response, status) {
        if (status === 200) resolve(JSON.stringify(response));
        else {
          console.log(
            `error in sending sms : ${response} with status: ${status}`,
          );
          reject(new Error(status));
        }
      },
    );
  });
};

exports.sendOTP = (apiKey, receptor, data, otpTemplate) => {
  return new Promise((resolve, reject) => {
    const api = Kavenegar.KavenegarApi({
      apikey: apiKey,
    });
    const receptorsArray = Array.isArray(receptor) ? receptor : [receptor];
    const dataArray = Array.isArray(data) ? data : [data];

    api.VerifyLookup(
      {
        receptor: receptorsArray.shift(),
        token: dataArray.shift(),
        template: otpTemplate,
      },
      function (response, status) {
        if (status === 200) resolve(JSON.stringify(response));
        else {
          console.log(
            `error in sending sms : ${response} with status: ${status}`,
          );
          reject(new Error(status));
        }
      },
    );
  });
};
