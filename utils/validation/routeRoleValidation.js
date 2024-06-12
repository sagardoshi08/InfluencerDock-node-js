/**
 * routeRoleValidation.js
 * @description :: validate each post and put request as per routeRole model
 */

const joi = require('joi');

/** validation keys and properties of routeRole */
exports.schemaKeys = joi.object({
  routeId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  roleId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow(''),
}).unknown(true);

/** validation keys and properties of routeRole for updation */
exports.updateSchemaKeys = joi.object({
  routeId: joi.string().regex(/^[0-9a-fA-F]{24}$/).when({
    is: joi.exist(),
    then: joi.required(),
    otherwise: joi.optional(),
  }),
  roleId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.boolean().allow(null).allow(''),
  isDeleted: joi.boolean().allow(null).allow(''),
}).unknown(true);
