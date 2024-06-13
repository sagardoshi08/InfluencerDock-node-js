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
      host: 'sirrah.ssl.hosttech.eu',
      port: 465,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: 'noreply@influencerdock.com',
        pass: '8qyQt45^8',
      },
    });

    if (!Array.isArray(obj.to)) {
      obj.to = [obj.to];
    }
    const htmlText = await ejs.renderFile(`${__basedir}${obj.template}/html.ejs`, obj.data);

    // eslint-disable-next-line array-callback-return
    return await Promise.all(obj.to.map((emailId) => {
      const mailOpts = {
        from: obj.from || 'noreply@yoyo.co',
        to: emailId,
        subject: obj.subject,
        html: htmlText,
      };

      console.log('mailOpts', mailOpts)

      transporter.sendMail(mailOpts, (err, response) => {
        console.log('response', response)
        console.log('err', response)
        if (err) {
          return `Mail error.${err}`;
        }
        return `Mail send.${response}`;
      });
    }));
  },
};
