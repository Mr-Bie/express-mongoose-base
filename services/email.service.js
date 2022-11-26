// Dependencies
const nodemailer = require("nodemailer");

// Config
const SMTP = [
  {
    host: "45.156.185.145",
    port: 25,
    tls: { rejectUnauthorized: false },
    auth: {
      user: "support@puzzlegp.ir",
      pass: "PuzzleGP12345",
    },
  },
];

exports.sendEmail = (name, from, to, subject, data) =>
  new Promise(async (resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport(SMTP.shift());

      const mailOptions = {
        from: {
          name: name,
          address: from,
        },
        to: to.toString().toLowerCase(),
        subject: subject,
        text: data,
      };

      await transporter.sendMail(mailOptions, (err, info) => {
        if (err) reject(err);
        console.log(`Email sent to ${to}`);
        resolve(info);
      });
    } catch (err) {
      reject(err);
    }
  });

exports.sendTemplatedEmail = (name, from, templatePath, to, subject, data) =>
  new Promise((resolve, reject) => {
    try {
      ejs.renderFile(
        "./views/templates/email/test.ejs",
        { title: data.title, data: data.data },
        {},
        (err, res) => {
          if (err)
            console.log(`error rendering file for sending email : ${err}`);
          else {
            const mailOptions = {
              from: {
                name: name,
                address: from,
              },
              to: to.toString().toLowerCase(),
              subject: subject,
              html: res,
            };
            transporter.sendMail(mailOptions, function (error, info) {
              if (err) {
                console.log(`error sending email : ${err}`);
                reject(err);
              }
              console.log(info);
              console.log(`email sent to ${to}`);
              resolve(info);
            });
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });

/*exports.sendGroupedEmail = (smtp, to, subject, data) => {
  const switchLimit = 3;
  return new Promise((resolve, reject) => {
    const emailCount = to.length;
    const smtpArray = Array.isArray(smtp) ? smtp : [smtp];
    const smtpCount = smtpArray.length;
    console.log(smtpArray);
    let counter = 0;
    let emailSentArray = [];
    for (let i = 0; i < emailCount; i++) {
      const choseSMTP =
        smtpArray[Math.floor(counter / switchLimit) % smtpCount];
      console.log(
        `Counter : ${counter}, SMTP index : ${
          Math.floor(counter / switchLimit) % smtpCount
        }`
      );
      emailSentArray.push({ email: to[counter], smtp: choseSMTP.host });
      counter++;
    }
    resolve(emailSentArray);
  });
};*/
