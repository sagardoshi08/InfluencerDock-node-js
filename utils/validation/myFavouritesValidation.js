/**
 * myFavouritesValidation.js
 * @description :: validate each post and put request as per myFavourites model
 */

const joi = require('joi');

/** validation keys and properties of myFavourites */
exports.schemaKeys = joi.object({
  favouriteByUserId: joi.string().allow(null).allow(''),
  favouriteUserId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
}).unknown(true);

/** validation keys and properties of myFavourites for updation */
exports.updateSchemaKeys = joi.object({
  favouriteByUserId: joi.string().allow(null).allow(''),
  favouriteUserId: joi.string().regex(/^[0-9a-fA-F]{24}$/).allow(null).allow(''),
  isActive: joi.string().allow(null).allow(''),
  isDeleted: joi.boolean(),
}).unknown(true);
