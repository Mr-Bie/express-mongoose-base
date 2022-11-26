// Dependencies

const smtps = [
  {
    host: "mail.puzzlegp.ir",
    port: 25,
    tls: { rejectUnauthorized: false },
    auth: {
      user: "support@puzzlegp.ir",
      pass: "PuzzleGP12345",
    },
  },
  {
    host: "mail.minaroya2022.xyz",
    port: 587,
    tls: { rejectUnauthorized: false },
    secure: true,
    auth: {
      user: "hooshsaman@minaroya2022.xyz",
      pass: "Pouya9998@",
    },
  },
];

module.exports = { smtps };
