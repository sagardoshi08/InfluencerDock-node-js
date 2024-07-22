/**
 * viewsValidation.js
 * @description :: validate each post and put request as per views model
 */

const joi = require('joi');

/** validation keys and properties of views */
exports.schemaKeys = joi.object({
  username: joi.string().allow(null).allow(''),
  session_id: joi.string().allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
}).unknown(true);

/** validation keys and properties of views for updation */
exports.updateSchemaKeys = joi.object({
  username: joi.string().allow(null).allow(''),
  session_id: joi.string().allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
}).unknown(true);
