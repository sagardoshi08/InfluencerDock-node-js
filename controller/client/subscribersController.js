const Subscribers = require('../../model/subscribers');
const subscribersSchemaKey = require('../../utils/validation/subscribersValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');

/**
 * @description : create document of Subscribers in mongodb collection.
 * @param {object} req : request including body for creating document.
 * @param {object} res : response of created document
 * @return {object} : created Subscribers. {status, message, data}
 */
const addSubscribers = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    const validateRequest = validation.validateParamsWithJoi(dataToCreate, subscribersSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate = new Subscribers(dataToCreate);
    const result = await dbService.createDocument(Subscribers, dataToCreate);
    return res.success({ data: result });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.validationError({ message: error.message });
    }
    if (error.code && error.code === 11000) {
      return res.validationError({ message: error.message });
    }
    return res.internalServerError({ message: error.message });
  }
};

module.exports = { addSubscribers };
