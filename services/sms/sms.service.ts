// Utils
import { SmsProviders } from "./sms-providers.enum";
const kavenegarConfig = require("./providers/kavenegar.config");
const ghasedakConfig = require("./providers/ghasedak.config");
const parsgreenConfig = require("./providers/parsgreen.config");

// Constants
const apiKey = process.env.SMS_API_KEY;
const provider = process.env.SMS_PROVIDER;
const lineNumber = process.env.SMS_LINE_NUMBER;
const otpTemplate = process.env.SMS_OTP_TEMPLATE;

export const sendOTP = (receptor, data) => {
  return new Promise(async (resolve, reject) => {
    if (
      !Object.values(SmsProviders)
        .filter((v) => isNaN(Number(v)))
        .includes(provider)
    ) {
      reject("invalid sms provider");
    }
    let response, err;
    try {
      switch (provider) {
        case "kavenegar": {
          response = await kavenegarConfig.sendOTP(
            apiKey,
            receptor,
            data,
            otpTemplate
          );
          break;
        }
        case "ghasedak": {
          response = await ghasedakConfig.sendOTP(
            apiKey,
            receptor,
            data,
            otpTemplate
          );
          break;
        }
        case "parsgreen": {
          response = await parsgreenConfig.sendOTP(
            apiKey,
            receptor,
            data,
            otpTemplate
          );
          break;
        }
        default:
          reject("OTP not sent!");
      }
      console.log(response);
      if (!response?.R_Success) reject(response);
    } catch (error) {
      console.log(error);
      err = error;
    }
    if (err) reject(err);
    resolve(response);
  });
};

export const send = (receptors, data) => {
  return new Promise(async (resolve, reject) => {
    if (
      !Object.values(SmsProviders)
        .filter((v) => isNaN(Number(v)))
        .includes(provider)
    ) {
      reject("invalid sms provider");
    }

    let err, response;
    try {
      switch (provider) {
        case "kavenegar": {
          response = await kavenegarConfig.send(
            apiKey,
            lineNumber,
            receptors,
            data
          );
          break;
        }
        case "ghasedak": {
          response = await ghasedakConfig.sendMultiple(
            apiKey,
            lineNumber,
            receptors,
            data
          );
          break;
        }
        case "parsgreen": {
          response = await parsgreenConfig.send(
            apiKey,
            lineNumber,
            receptors,
            data
          );
          break;
        }
        default:
          reject("OTP not sent!");
      }
    } catch (error) {
      err = error;
    }
    if (err) reject(err);
    resolve(response);
  });
};
