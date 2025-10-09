const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});
