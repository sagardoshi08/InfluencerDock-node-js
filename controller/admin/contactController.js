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
    dataToCreate.addedBy = req.user.id;
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

/**
 * @description : find all documents of Contact from collection based on query and options.
 * @param {object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {object} res : response contains data found from collection.
 * @return {object} : found Contact(s). {status, message, data}
 */
const findAllContact = async (req, res) => {
  try {
    const query = req.body && req.body.query ? { ...req.body.query } : {};
    const options = req.body && req.body.options ? { ...req.body.options } : {};
    if (req.body.isCountOnly) {
      const totalRecords = await dbService.countDocument(Contact, query);
      return res.success({ data: { totalRecords } });
    }

    const result = await dbService.getAllDocuments(Contact, query, options);
    if (result && result.data && result.data.length) {
      return res.success({ data: result });
    }
    return res.recordNotFound();
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : find document of Contact from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains document retrieved from table.
 * @return {object} : found Contact. {status, message, data}
 */
const getContact = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.getDocumentByQuery(Contact, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : returns total number of documents of Contact.
 * @param {object} req : request including where object to apply filters in req body
 * @param {object} res : response that returns total number of documents.
 * @return {object} : number of documents. {status, message, data}
 */
const getContactCount = async (req, res) => {
  try {
    const where = req.body && req.body.where ? { ...req.body.where } : {};
    const totalRecords = await dbService.countDocument(Contact, where);
    return res.success({ data: { totalRecords } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : update document of Contact with data by id.
 * @param {object} req : request including id in request params and data in request body.
 * @param {object} res : response of updated Contact.
 * @return {object} : updated Contact. {status, message, data}
 */
const updateContact = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body };
    const validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      contactSchemaKey.updateSchemaKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    delete dataToUpdate.addedBy;
    dataToUpdate.updatedBy = req.user.id;
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(Contact, query, dataToUpdate);
    if (!result) {
      return res.recordNotFound();
    }
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

/**
 * @description : partially update document of Contact with data by id;
 * @param {object} req : request including id in request params and data in request body.
 * @param {object} res : response of updated Contact.
 * @return {object} : updated Contact. {status, message, data}
 */
const partialUpdateContact = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body };
    delete dataToUpdate.addedBy;
    dataToUpdate.updatedBy = req.user.id;
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(Contact, query, dataToUpdate);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : deactivate document of Contact from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains updated document of Contact.
 * @return {object} : deactivated Contact. {status, message, data}
 */
const softDeleteContact = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(Contact, query, { isDeleted: true });
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : deactivate multiple documents of Contact from table by ids;
 * @param {object} req : request including array of ids in request body.
 * @param {object} res : response contains updated documents of Contact.
 * @return {object} : number of deactivated documents of Contact. {status, message, data}
 */
const softDeleteManyContact = async (req, res) => {
  try {
    if (!req.body || !req.body.ids) {
      return res.badRequest();
    }
    const query = { _id: { $in: req.body.ids } };
    const result = await dbService.bulkUpdate(Contact, query, {
      isDeleted: true,
      updatedBy: req.user.id,
    });
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : update multiple records of Contact with data by filter.
 * @param {object} req : request including filter and data in request body.
 * @param {object} res : response of updated Contacts.
 * @return {object} : updated Contacts. {status, message, data}
 */
const bulkUpdateContact = async (req, res) => {
  try {
    const filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    const dataToUpdate = req.body && req.body.data ? { ...req.body.data } : {};
    dataToUpdate.updatedBy = req.user.id;
    const result = await dbService.bulkUpdate(Contact, filter, dataToUpdate);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : delete document of Contact from table.
 * @param {object} req : request including id as req param.
 * @param {object} res : response contains deleted document.
 * @return {object} : deleted Contact. {status, message, data}
 */
const deleteContact = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndDeleteDocument(Contact, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : delete documents of Contact in table by using ids.
 * @param {object} req : request including array of ids in request body.
 * @param {object} res : response contains no of documents deleted.
 * @return {object} : no of documents deleted. {status, message, data}
 */
const deleteManyContact = async (req, res) => {
  try {
    if (!req.body || !req.body.ids) {
      return res.badRequest();
    }
    const query = { _id: { $in: req.body.ids } };
    const result = await dbService.deleteMany(Contact, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  addContact,
  findAllContact,
  getContact,
  getContactCount,
  updateContact,
  partialUpdateContact,
  softDeleteContact,
  softDeleteManyContact,
  bulkUpdateContact,
  deleteContact,
  deleteManyContact,
};
