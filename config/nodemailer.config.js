const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  //   secure: true,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS,
  },
});

module.exports = { transporter };
