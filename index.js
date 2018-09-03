const generateFile = require('./query');
const sendEmail = require('./mailer');

generateFile();

setTimeout(sendEmail, 3000);
