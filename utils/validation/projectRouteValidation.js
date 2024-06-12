/**
 * projectRouteValidation.js
 * @description :: validate each post and put request as per projectRoute model
 */

const joi = require('joi');

/** validation keys and properties of projectRoute */
exports.schemaKeys = joi.object({
  route_name: joi.string().required(),
  method: joi.string().required(),
  uri: joi.string().required(),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow(''),
}).unknown(true);

/** validation keys and properties of projectRoute for updation */
exports.updateSchemaKeys = joi.object({
  route_name: joi.string().when({
    is: joi.exist(),
    then: joi.required(),
    otherwise: joi.optional(),
  }),
  method: joi.string().when({
    is: joi.exist(),
    then: joi.required(),
    otherwise: joi.optional(),
  }),
  uri: joi.string().when({
    is: joi.exist(),
    then: joi.required(),
    otherwise: joi.optional(),
  }),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow(''),
}).unknown(true);
