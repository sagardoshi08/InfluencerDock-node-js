/**
 * auth.js
 * @description :: routes of authentication APIs
 */

const express = require('express');

const routes = express.Router();
const auth = require('../../middleware/auth');
const { PLATFORM } = require('../../constants/authConstant');

const authController = require('../../controller/client/authController');

routes.route('/register').post(authController.register);
routes.post('/checkEmailUsername', authController.checkEmailUsername);
routes.post('/login', authController.login);
routes.route('/forgot-password').post(authController.forgotPassword);
routes.route('/validate-otp').post(authController.validateResetPasswordOtp);
routes.route('/reset-password').put(authController.resetPassword);
routes.route('/logout').post(auth(PLATFORM.CLIENT), authController.logout);

module.exports = routes;
