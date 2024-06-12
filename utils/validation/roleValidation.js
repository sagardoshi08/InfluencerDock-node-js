/**
 * roleValidation.js
 * @description :: validate each post and put request as per role model
 */

const joi = require('joi');

/** validation keys and properties of role */
exports.schemaKeys = joi.object({
  name: joi.string().required(),
  code: joi.string().required(),
  weight: joi.number().integer().required(),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow(''),
}).unknown(true);

/** validation keys and properties of role for updation */
exports.updateSchemaKeys = joi.object({
  name: joi.string().when({
    is: joi.exist(),
    then: joi.required(),
    otherwise: joi.optional(),
  }),
  code: joi.string().when({
    is: joi.exist(),
    then: joi.required(),
    otherwise: joi.optional(),
  }),
  weight: joi.number().integer().when({
    is: joi.exist(),
    then: joi.required(),
    otherwise: joi.optional(),
  }),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow(''),
}).unknown(true);
