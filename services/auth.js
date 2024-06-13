/**
 * auth.js
 * @description :: service functions used in authentication
 */

const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const bcrypt = require('bcrypt');
const uuid = require('uuid').v4;
const User = require('../model/user');
const dbService = require('../utils/dbService');
const userTokens = require('../model/userTokens');
const {
  JWT, LOGIN_ACCESS,
  PLATFORM, MAX_LOGIN_RETRY_LIMIT, LOGIN_REACTIVE_TIME, FORGOT_PASSWORD_WITH,
} = require('../constants/authConstant');
const common = require('../utils/common');
const emailService = require('./email/emailService');
const smsService = require('./sms/smsService');

/**
 * @description : service to generate JWT token for authentication.
 * @param {object} user : user who wants to login.
 * @param {string} secret : secret for JWT.
 * @return {string}  : returns JWT token.
 */
const generateToken = async (user, secret) => jwt.sign({
  id: user.id,
  email: user.email,
}, secret, { expiresIn: JWT.EXPIRES_IN * 60 });

/**
 * @description : service of login user.
 * @param {string} username : username of user.
 * @param {string} password : password of user.
 * @param {string} platform : platform of requested route to login.
 * @param {boolean} roleAccess: a flag to request role access of user.
 * @return {object} : returns authentication status. {flag, data}
 */
const loginUser = async (username, password, platform, roleAccess) => {
  try {
    const where = { email: username };
    let user = await dbService.getDocumentByQuery(User, where);
    if (user) {
      if (user.loginRetryLimit >= MAX_LOGIN_RETRY_LIMIT) {
        const now = dayjs();
        if (user.loginReactiveTime) {
          const limitTime = dayjs(user.loginReactiveTime);
          if (limitTime > now) {
            const expireTime = dayjs().add(LOGIN_REACTIVE_TIME, 'minute');
            if (!(limitTime > expireTime)) {
              return {
                flag: true,
                data: `you have exceed the number of limit.you can login after ${common.getDifferenceOfTwoDatesInTime(now, limitTime)}.`,
              };
            }
            await dbService.updateDocument(User, user.id, {
              loginReactiveTime: expireTime.toISOString(),
              loginRetryLimit: user.loginRetryLimit + 1,
            });
            return {
              flag: true,
              data: `you have exceed the number of limit.you can login after ${common.getDifferenceOfTwoDatesInTime(now, expireTime)}.`,
            };
          }
          user = await dbService.findOneAndUpdateDocument(User, { _id: user.id }, {
            loginReactiveTime: '',
            loginRetryLimit: 0,
          }, { new: true });
        } else {
          // send error
          const expireTime = dayjs().add(LOGIN_REACTIVE_TIME, 'minute');
          await dbService.updateDocument(User, user.id, {
            loginReactiveTime: expireTime.toISOString(),
            loginRetryLimit: user.loginRetryLimit + 1,
          });
          return {
            flag: true,
            data: `you have exceed the number of limit.you can login after ${common.getDifferenceOfTwoDatesInTime(now, expireTime)}.`,
          };
        }
      }
      const isPasswordMatched = await user.isPasswordMatch(password);
      if (isPasswordMatched) {
        const {
          password, ...userData
        } = user.toJSON();
        let token;
        if (!user.role) {
          return {
            flag: true,
            data: 'You have not assigned any role',
          };
        }
        console.log('platform', platform)
        console.log('PLATFORM.admin', PLATFORM.ADMIN)
        if (platform === PLATFORM.ADMIN) {
          if (!LOGIN_ACCESS[user.role].includes(PLATFORM.ADMIN)) {
            return {
              flag: true,
              data: 'you are unable to access this platform',
            };
          }
          token = await generateToken(userData, JWT.ADMIN_SECRET);
        } else if (platform === PLATFORM.CLIENT) {
          if (!LOGIN_ACCESS[user.role].includes(PLATFORM.CLIENT)) {
            return {
              flag: true,
              data: 'you are unable to access this platform',
            };
          }
          token = await generateToken(userData, JWT.CLIENT_SECRET);
          console.log('C token', token)
        }
        if (user.loginRetryLimit) {
          await dbService.updateDocument(User, user.id, {
            loginRetryLimit: 0,
            loginReactiveTime: '',
          });
        }
        const expire = dayjs().add(JWT.EXPIRES_IN, 'second').toISOString();
        await dbService.createDocument(userTokens, {
          userId: user.id,
          token,
          tokenExpiredTime: expire,
        });
        let userToReturn = {
          ...userData,
          token,
        };
        let roleAccessData = {};
        if (roleAccess) {
          roleAccessData = await common.getRoleAccessData(user.id);
          userToReturn = {
            ...userToReturn,
            roleAccess: roleAccessData,
          };
        }
        console.log('userToReturn', userToReturn);
        return {
          flag: false,
          data: userToReturn,
        };
      }
      await dbService.updateDocument(User, user.id, { loginRetryLimit: user.loginRetryLimit + 1 });
      return {
        flag: true,
        data: 'Incorrect Password',
      };
    }
    return {
      flag: true,
      data: 'User not exists',
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * @description : service to change password.
 * @param {object} params : object of new password, old password and user id.
 * @return {object}  : returns status of change password. {flag,data}
 */
const changePassword = async (params) => {
  try {
    let password = params.newPassword;
    const { oldPassword } = params;
    const where = { _id: params.userId };
    const user = await dbService.getDocumentByQuery(User, where);
    if (user && user.id) {
      const isPasswordMatch = await user.isPasswordMatch(oldPassword);
      if (!isPasswordMatch) {
        return {
          flag: true,
          data: 'Incorrect old password',
        };
      }
      password = await bcrypt.hash(password, 8);
      const updatedUser = dbService.updateDocument(User, user.id, { password });
      if (updatedUser) {
        return {
          flag: false,
          data: 'Password changed successfully',
        };
      }
      return {
        flag: true,
        data: 'password can not changed due to some error.please try again',
      };
    }
    return {
      flag: true,
      data: 'User not found',
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * @description : service to send notification on reset password.
 * @param {object} user : user document
 * @return {}  : returns status where notification is sent or not
 */
const sendResetPasswordNotification = async (user) => {
  let resultOfEmail = false;
  let resultOfSMS = false;
  try {
    const token = uuid();
    let expires = dayjs();
    expires = expires.add(FORGOT_PASSWORD_WITH.EXPIRE_TIME, 'minute').toISOString();
    await dbService.updateDocument(User, user.id,
      {
        resetPasswordLink: {
          code: token,
          expireTime: expires,
        },
      });
    if (FORGOT_PASSWORD_WITH.LINK.email) {
      const viewType = '/reset-password/';
      const msg = 'Click on the link below to reset your password.';
      const mailObj = {
        subject: 'Reset Password',
        to: user.email,
        template: '/views/emailTemplate',
        data: {
          link: `http://localhost:${process.env.PORT}${viewType}${token}`,
          linkText: 'Reset Password',
          message: msg,
        },
      };
      try {
        await emailService.sendMail(mailObj);
        resultOfEmail = true;
      } catch (error) {
        console.log(error);
      }
    }
    if (FORGOT_PASSWORD_WITH.LINK.sms) {
      const viewType = '/reset-password/';
      const msg = `Click on the link to reset your password.
                http://localhost:${process.env.PORT}${viewType + token}`;
      const smsObj = {
        to: user.mobileNo,
        message: msg,
      };
      try {
        await smsService.sendSMS(smsObj);
        resultOfSMS = true;
      } catch (error) {
        console.log(error);
      }
    }
    return {
      resultOfEmail,
      resultOfSMS,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * @description : service to reset password.
 * @param {object} user : user document
 * @param {string} newPassword : new password to be set.
 * @return {}  : returns status whether new password is set or not. {flag, data}
 */
const resetPassword = async (user, newPassword) => {
  try {
    const where = { _id: user.id };
    const dbUser = await dbService.getDocumentByQuery(User, where);
    if (!dbUser) {
      return {
        flag: true,
        data: 'User not found',
      };
    }
    newPassword = await bcrypt.hash(newPassword, 8);
    await dbService.updateDocument(User, user.id, {
      password: newPassword,
      resetPasswordLink: null,
      loginRetryLimit: 0,
    });
    const mailObj = {
      subject: 'Reset Password',
      to: user.email,
      template: '/views/successfullyResetPassword',
      data: {
        isWidth: true,
        email: user.email || '-',
        message: 'Password Successfully Reset',
      },
    };
    await emailService.sendMail(mailObj);
    return {
      flag: false,
      data: 'Password reset successfully',
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  loginUser,
  changePassword,
  resetPassword,
  sendResetPasswordNotification,
};
