/**
 * subscribersValidation.js
 * @description :: validate each post and put request as per subscribers model
 */

const joi = require('joi');

/** validation keys and properties of subscribers */
exports.schemaKeys = joi.object({
  email: joi.string().allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
}).unknown(true);

/** validation keys and properties of subscribers for updation */
exports.updateSchemaKeys = joi.object({
  email: joi.string().allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
}).unknown(true);
