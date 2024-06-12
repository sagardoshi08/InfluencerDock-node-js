/**
 * contactValidation.js
 * @description :: validate each post and put request as per contact model
 */

const joi = require('joi');

/** validation keys and properties of contact */
exports.schemaKeys = joi.object({
  first_name: joi.string().allow(null).allow(''),
  last_name: joi.string().allow(null).allow(''),
  email: joi.string().allow(null).allow(''),
  language: joi.string().allow(null).allow(''),
  message: joi.string().allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
}).unknown(true);

/** validation keys and properties of contact for updation */
exports.updateSchemaKeys = joi.object({
  first_name: joi.string().allow(null).allow(''),
  last_name: joi.string().allow(null).allow(''),
  email: joi.string().allow(null).allow(''),
  language: joi.string().allow(null).allow(''),
  message: joi.string().allow(null).allow(''),
  isActive: joi.boolean(),
  isDeleted: joi.boolean(),
}).unknown(true);
