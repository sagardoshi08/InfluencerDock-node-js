/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/**
 * auth.js
 * @description :: middleware that checks authentication and authorization of user
 */

const passport = require('passport');
const {
  LOGIN_ACCESS, PLATFORM,
} = require('../constants/authConstant');
const userTokens = require('../model/userTokens');
const dbService = require('../utils/dbService');

/**
 * @description : returns callback that verifies platform access of user
 * @param {object} req : request of route.
 * @param {callback} resolve : resolve callback for succeeding method.
 * @param {callback} reject : reject callback for error.
 * @param {integer} platform : platform from constants which user wants to login.
 */
const verifyCallback = (req, resolve, reject, platform) => async (err, user, info) => {
  if (err || info || !user) {
    return reject('Unauthorized User');
  }
  req.user = user;
  if (!user.isActive) {
    return reject('User is deactivated');
  }
  const userToken = await dbService.getDocumentByQuery(userTokens, {
    token: (req.headers.authorization).replace('Bearer ', ''),
    userId: user.id,
  });
  if (!userToken) {
    return reject('Token not found');
  }
  if (userToken.isTokenExpired) {
    return reject('Token is Expired');
  }
  if (user.role) {
    const allowedPlatforms = LOGIN_ACCESS[user.role] ? LOGIN_ACCESS[user.role] : [];
    if (!allowedPlatforms.includes(platform)) {
      return reject('Unauthorized user');
    }
  }
  resolve();
};

/**
 * @description : authentication middleware for request.
 * @param {object} req : request of route.
 * @param {object} res : response of route.
 * @param {callback} next : executes the next middleware succeeding the current middleware.
 * @param {integer} platform : platform from constants which user wants to login.
 */
const auth = (platform) => async (req, res, next) => {
  if (platform == PLATFORM.ADMIN) {
    return new Promise((resolve, reject) => {
      passport.authenticate('admin-rule', { session: false }, verifyCallback(req, resolve, reject, platform))(
        req,
        res,
        next,
      );
    })
      .then(() => next())
      .catch((err) => res.unAuthorized());
  }
  if (platform == PLATFORM.CLIENT) {
    return new Promise((resolve, reject) => {
      passport.authenticate('client-rule', { session: false }, verifyCallback(req, resolve, reject, platform))(
        req,
        res,
        next,
      );
    })
      .then(() => next())
      .catch((err) => res.unAuthorized());
  }
};

module.exports = auth;
