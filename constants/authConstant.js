/**
 * authConstant.js
 * @description :: constants used in authentication
 */

const JWT = {
  ADMIN_SECRET: 'myjwtadminsecret',
  CLIENT_SECRET: 'myjwtclientsecret',
  EXPIRES_IN: 10000,
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
