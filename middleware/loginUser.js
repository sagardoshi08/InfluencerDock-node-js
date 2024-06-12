/**
 * loginUser.js
 * @description :: middleware that verifies JWT token
 */

const jwt = require('jsonwebtoken');
const adminSecret = require('../constants/authConstant').JWT.ADMIN_SECRET;
const clientSecret = require('../constants/authConstant').JWT.CLIENT_SECRET;
const { PLATFORM } = require('../constants/authConstant');

const authenticateJWT = (platform) => async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    let secret = '';
    if (platform == PLATFORM.ADMIN) {
      secret = adminSecret;
    } else if (platform == PLATFORM.CLIENT) {
      secret = clientSecret;
    }
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.unAuthorized();
      }
      req.user = user;
      next();
    });
  } else {
    return res.unAuthorized();
  }
};
module.exports = authenticateJWT;
