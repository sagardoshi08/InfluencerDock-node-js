/**
 * authConstant.js
 * @description :: constants used in authentication
 */

const JWT = {
  ADMIN_SECRET: '98c98d7c98d7cs98c7d98c7sdc8sdc9u90ds',
  CLIENT_SECRET: 'dc89ds7c89ds7cd9s8c7ds9c7ds9c7sd98c',
  EXPIRES_IN: 525600,
};

const USER_ROLE = {
  User: 1,
  Admin: 2,
};

const PLATFORM = {
  ADMIN: 1,
  CLIENT: 2,
};

const LOGIN_ACCESS = {
  [USER_ROLE.Admin]: [PLATFORM.ADMIN],
  [USER_ROLE.User]: [PLATFORM.CLIENT],
};

const DEFAULT_ROLE = 1;

const MAX_LOGIN_RETRY_LIMIT = 5;
const LOGIN_REACTIVE_TIME = 30;

const FORGOT_PASSWORD_WITH = {
  EXPIRE_TIME: 60,
  LINK: {
    email: true,
    sms: false,
  },
};

module.exports = {
  JWT,
  USER_ROLE,
  DEFAULT_ROLE,
  PLATFORM,
  MAX_LOGIN_RETRY_LIMIT,
  LOGIN_REACTIVE_TIME,
  FORGOT_PASSWORD_WITH,
  LOGIN_ACCESS,
};
