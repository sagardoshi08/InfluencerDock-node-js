/**
 * clientPassportStrategy.js
 */

const {
  Strategy, ExtractJwt,
} = require('passport-jwt');
const { JWT } = require('../constants/authConstant');
const user = require('../model/user');

/**
 * @description : exports authentication strategy for client using passport.js
 * @params {object} passport : passport object for authentication
 * @return {callback} : returns callback to be used in middleware
 */
const clientPassportStrategy = (passport) => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = JWT.CLIENT_SECRET;
  passport.use('client-rule',
    new Strategy(options, (payload, done) => {
      user.findOne({ _id: payload.id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, { ...user.toJSON() });
        }
        return done('No User Found', {});
      });
    }));
};

module.exports = { clientPassportStrategy };
