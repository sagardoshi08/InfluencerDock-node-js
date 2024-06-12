const Contact = require('../../model/contact');
const contactSchemaKey = require('../../utils/validation/contactValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');

/**
 * @description : create document of Contact in mongodb collection.
 * @param {object} req : request including body for creating document.
 * @param {object} res : response of created document
 * @return {object} : created Contact. {status, message, data}
 */
const addContact = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    const validateRequest = validation.validateParamsWithJoi(dataToCreate, contactSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate = new Contact(dataToCreate);
    const result = await dbService.createDocument(Contact, dataToCreate);
    return res.success({ data: result });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.validationError({ message: error.message });
    }
    if (error.code && error.code == 11000) {
      return res.validationError({ message: error.message });
    }
    return res.internalServerError({ message: error.message });
  }
};

module.exports = { addContact };
