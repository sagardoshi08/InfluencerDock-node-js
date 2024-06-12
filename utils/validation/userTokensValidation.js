/**
 * userTokensValidation.js
 * @description :: validate each post and put request as per userTokens model
 */

const joi = require('joi');

/** validation keys and properties of userTokens */
exports.schemaKeys = joi.object({
  userId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  token: joi.string().allow(null).allow(''),
  tokenExpiredTime: joi.date().allow(null).allow(''),
  isTokenExpired: joi.boolean().default(false).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
}).unknown(true);

/** validation keys and properties of userTokens for updation */
exports.updateSchemaKeys = joi.object({
  userId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  token: joi.string().allow(null).allow(''),
  tokenExpiredTime: joi.date().allow(null).allow(''),
  isTokenExpired: joi.boolean().default(false).allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
}).unknown(true);
