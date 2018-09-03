'use strict';
const nodemailer = require('nodemailer');
const keys = require('./config');

function sendEmail() {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.adform.com',
    port: 25,
    secure: false,
    tls: {
      rejectUnauthorized: false
    }
  });

  //set up message parameters
  let message = {
    from: keys.EMAIL_SENDER,
    to: keys.EMAIL_RECEIVER,
    cc: keys.EMAIL_CC,
    subject: keys.EMAIL_SUBJECT,
    text: 'Attached you will find daily impressions report.',
    attachments: [
      {
        path:
          'C:/Users/p.kascionis/Desktop/autosender/excel/Daily report for BSW + SSP sources.xlsx'
      }
    ]
  };

  // send mail with defined transport object
  transporter.sendMail(message, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });
}

module.exports = sendEmail;
