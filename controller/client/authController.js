/**
 * authController.js
 * @description :: exports authentication methods
 */

const dayjs = require('dayjs');
const authService = require('../../services/auth');
const User = require('../../model/user');
const dbService = require('../../utils/dbService');
const userTokens = require('../../model/userTokens');
const userSchemaKey = require('../../utils/validation/userValidation');
const validation = require('../../utils/validateRequest');
const { uniqueValidation } = require('../../utils/common');
const { PLATFORM } = require('../../constants/authConstant');

/**
 * @description : user registration
 * @param {object} req : request for register
 * @param {object} res : response for register
 * @return {object} : response for register {status, message, data}
 */
const register = async (req, res) => {
  try {
    const validateRequest = validation.validateParamsWithJoi(
      req.body,
      userSchemaKey.schemaKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    const data = new User({ ...req.body });
    const unique = await uniqueValidation(User, req.body);
    if (!unique) {
      return res.validationError({ message: 'User Registration Failed, Duplicate Data found' });
    }
    const result = await dbService.createDocument(User, data);
    return res.success({ data: result });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.validationError({ message: error.message });
    }
    if (error.code && error.code == 11000) {
      return res.validationError({ message: error.message });
    }
    return res.internalServerError();
  }
};

/**
 * @description : send email or sms to user with OTP on forgot password
 * @param {object} req : request for forgotPassword
 * @param {object} res : response for forgotPassword
 * @return {object} : response for forgotPassword {status, message, data}
 */
const forgotPassword = async (req, res) => {
  const params = { ...req.body };
  try {
    if (!params.email) {
      return res.badRequest();
    }
    const where = { email: params.email };
    params.email = params.email.toString().toLowerCase();
    const found = await dbService.getDocumentByQuery(User, where);
    if (!found) {
      return res.recordNotFound();
    }
    const {
      resultOfEmail, resultOfSMS,
    } = await authService.sendResetPasswordNotification(found);
    if (resultOfEmail && resultOfSMS) {
      return res.success({ message: 'otp successfully send.' });
    } if (resultOfEmail && !resultOfSMS) {
      return res.success({ message: 'otp successfully send to your email.' });
    } if (!resultOfEmail && resultOfSMS) {
      return res.success({ message: 'otp successfully send to your mobile number.' });
    }
    return res.internalServerError({ message: 'otp can not be sent due to some issue try again later' });
  } catch (error) {
    return res.internalServerError();
  }
};

/**
 * @description : validate OTP
 * @param {object} req : request for validateResetPasswordOtp
 * @param {object} res : response for validateResetPasswordOtp
 * @return {object} : response for validateResetPasswordOtp  {status, message, data}
 */
const validateResetPasswordOtp = async (req, res) => {
  const params = req.body;
  try {
    if (!params || !params.otp) {
      return res.badRequest();
    }
    const found = await dbService.getDocumentByQuery(User, { 'resetPasswordLink.code': params.otp });
    if (!found || !found.resetPasswordLink.expireTime) {
      return res.failure({ message: 'Invalid OTP' });
    }
    if (dayjs(new Date()).isAfter(dayjs(found.resetPasswordLink.expireTime))) {
      return res.failure({ message: 'Your reset password link is expired or invalid' });
    }
    await dbService.updateDocument(User, found.id, { resetPasswordLink: {} });
    return res.success({ message: 'Otp verified' });
  } catch (error) {
    return res.internalServerError();
  }
};

/**
 * @description : reset password with code and new password
 * @param {object} req : request for resetPassword
 * @param {object} res : response for resetPassword
 * @return {object} : response for resetPassword {status, message, data}
 */
const resetPassword = async (req, res) => {
  const params = req.body;
  try {
    if (!params.code || !params.newPassword) {
      return res.badRequest();
    }
    const found = await dbService.getDocumentByQuery(User, { 'resetPasswordLink.code': params.code });
    if (!found || !found.resetPasswordLink.expireTime) {
      return res.failure({ message: 'Invalid Code' });
    }
    if (dayjs(new Date()).isAfter(dayjs(found.resetPasswordLink.expireTime))) { // link expire
      return res.failure({ message: 'Your reset password link is expired or invalid' });
    }
    const result = await authService.resetPassword(found, params.newPassword);
    if (result.flag) {
      return res.failure({ message: result.data });
    }
    return res.success({ message: result.data });
  } catch (error) {
    return res.internalServerError();
  }
};

/**
 * @description : login with username and password
 * @param {object} req : request for login
 * @param {object} res : response for login
 * @return {object} : response for login {status, message, data}
 */
const login = async (req, res) => {
  try {
    const {
      username, password,
    } = req.body;
    if (!username || !password) {
      return res.badRequest();
    }
    let roleAccess = false;
    if (req.body.includeRoleAccess) {
      roleAccess = req.body.includeRoleAccess;
    }
    const result = await authService.loginUser(username, password, PLATFORM.CLIENT, roleAccess);
    if (result.flag) {
      return res.badRequest({ message: result.data });
    }
    return res.success({
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    return res.internalServerError();
  }
};

/**
 * @description : logout user
 * @param {object} req : request for logout
 * @param {object} res : response for logout
 * @return {object} : response for logout {status, message, data}
 */
const logout = async (req, res) => {
  try {
    const userToken = await dbService.getDocumentByQuery(userTokens, {
      token: (req.headers.authorization).replace('Bearer ', ''),
      userId: req.user.id,
    });
    const updatedDocument = { isTokenExpired: true };
    await dbService.updateDocument(userTokens, userToken.id, updatedDocument);
    return res.success({ message: 'Logged Out Successfully' });
  } catch (error) {
    return res.internalServerError();
  }
};

module.exports = {
  register,
  forgotPassword,
  validateResetPasswordOtp,
  resetPassword,
  login,
  logout,
};
