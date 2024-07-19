/**
 * partnerValidation.js
 * @description :: validate each post and put request as per partner model
 */

const joi = require('joi');

/** validation keys and properties of partner */
exports.schemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  image: joi.string().allow(null).allow(''),
  isActive: joi.boolean().default(true).allow(null).allow(''),
  isDeleted: joi.boolean(),
}).unknown(true);

/** validation keys and properties of partner for updation */
exports.updateSchemaKeys = joi.object({
  name: joi.string().allow(null).allow(''),
  image: joi.string().allow(null).allow(''),
  isActive: joi.boolean().default(true).allow(null).allow(''),
  isDeleted: joi.boolean(),
}).unknown(true);
