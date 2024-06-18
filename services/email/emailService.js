/* eslint-disable no-unused-vars */
/* eslint-disable no-return-await */
/* eslint-disable no-undef */
/**
 * emailService.js
 * @description :: exports function used in sending mails using mailgun provider
 */

const nodemailer = require('nodemailer');
const ejs = require('ejs');

module.exports = {
  sendMail: async (obj) => {
    const transporter = nodemailer.createTransport({
      name: process.env.SMTP_HOST,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // Use `true` for port 465, `false` for all other ports
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      logger: true,
      debug: true,
    });

    if (!Array.isArray(obj.to)) {
      obj.to = [obj.to];
    }
    const htmlText = await ejs.renderFile(`${__basedir}${obj.template}/html.ejs`, obj.data);

    // eslint-disable-next-line array-callback-return
    return await Promise.all(obj.to.map((emailId) => {
      const mailOpts = {
        from: obj.from || process.env.SMTP_USER,
        to: emailId,
        subject: obj.subject,
        html: htmlText,
      };

      transporter.sendMail(mailOpts, (err, response) => {
        console.log('response', response);
        console.log('err', response);
        if (err) {
          return `Mail error.${err}`;
        }
        return `Mail send.${response}`;
      });
    }));
  },
};
