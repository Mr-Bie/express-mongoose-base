// Dependencies
const nodemailer = require("nodemailer");

// Constants
const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpSender = process.env.SMTP_SENDER;
const smtpName = process.env.EMAIL_NAME;

exports.sendEmail = (to, subject, data) =>
  new Promise(async (resolve, reject) => {
    let err, response;
    try {
      const SMTP = {
        host: smtpHost,
        port: smtpPort,
        tls: { rejectUnauthorized: false },
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
        from: smtpSender,
      };
      const transporter = nodemailer.createTransport(SMTP);

      SMTP.from == null || SMTP.host == null || SMTP.port == null
        ? reject(new Error("SMTP is not provided"))
        : null;

      const mailOptions = {
        from: {
          address: SMTP.from,
          name: smtpName,
        },
        to: to.toString().toLowerCase(),
        subject: subject,
        html: data,
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return (err = error);
        }
        console.log(`Email sent to ${to}`);
        response = info;
      });
    } catch (error) {
      console.log(error);
      err = error;
    }
    if (err) reject(err);
    resolve(response);
  });
