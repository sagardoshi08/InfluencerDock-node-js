/**
 * emailService.js
 * @description :: exports function used in sending mails using mailgun provider
 */

const nodemailer = require('nodemailer');
const ejs = require('ejs');

module.exports = {
  sendMail: async (obj) => {
    const transporter = nodemailer.createTransport({
      service: 'Mailgun',
      auth: {
        user: '',
        pass: '',
      },
    });
    if (!Array.isArray(obj.to)) {
      obj.to = [obj.to];
    }
    const htmlText = await ejs.renderFile(`${__basedir}${obj.template}/html.ejs`, obj.data);

    return await Promise.all(obj.to.map((emailId) => {
      const mailOpts = {
        from: obj.from || 'noreply@yoyo.co',
        to: emailId,
        subject: obj.subject,
        html: htmlText,
      };
      transporter.sendMail(mailOpts, (err, response) => {
        if (err) {
          // ret.message = "Mail error.";
        } else {
          // ret.message = "Mail send.";
        }
      });
    }));
  },
};
