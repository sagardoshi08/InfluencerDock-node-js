const Views = require('../../model/views');
const viewsSchemaKey = require('../../utils/validation/viewsValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const { uniqueViewsValidation } = require('../../utils/common');

/**
 * @description : create document of Views in mongodb collection.
 * @param {object} req : request including body for creating document.
 * @param {object} res : response of created document
 * @return {object} : created Views. {status, message, data}
 */
const addViews = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    const validateRequest = validation.validateParamsWithJoi(dataToCreate, viewsSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    const unique = await uniqueViewsValidation(Views, req.body);
    if (!unique) {
      return res.validationError({ message: 'Duplicate Data found' });
    }

    dataToCreate = new Views(dataToCreate);
    const result = await dbService.createDocument(Views, dataToCreate);
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

/**
 * @description : find all documents of Views from collection based on query and options.
 * @param {object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {object} res : response contains data found from collection.
 * @return {object} : found Views(s). {status, message, data}
 */
const findAllViews = async (req, res) => {
  try {
    const query = req.body && req.body.query ? { ...req.body.query } : {};
    const options = req.body && req.body.options ? { ...req.body.options } : {};
    if (req.body.isCountOnly) {
      const totalRecords = await dbService.countDocument(Views, query);
      return res.success({ data: { totalRecords } });
    }

    const result = await dbService.getAllDocuments(Views, query, options);
    if (result && result.data && result.data.length) {
      return res.success({ data: result });
    }
    return res.recordNotFound();
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : find document of Views from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains document retrieved from table.
 * @return {object} : found Views. {status, message, data}
 */
const getViews = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.getDocumentByQuery(Views, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : returns total number of documents of Views.
 * @param {object} req : request including where object to apply filters in req body
 * @param {object} res : response that returns total number of documents.
 * @return {object} : number of documents. {status, message, data}
 */
const getViewsCount = async (req, res) => {
  try {
    const where = req.body && req.body.where ? { ...req.body.where } : {};
    const totalRecords = await dbService.countDocument(Views, where);
    return res.success({ data: { totalRecords } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : update document of Views with data by id.
 * @param {object} req : request including id in request params and data in request body.
 * @param {object} res : response of updated Views.
 * @return {object} : updated Views. {status, message, data}
 */
const updateViews = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body };
    const validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      viewsSchemaKey.updateSchemaKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(Views, query, dataToUpdate);
    if (!result) {
      return res.recordNotFound();
    }
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

/**
 * @description : partially update document of Views with data by id;
 * @param {object} req : request including id in request params and data in request body.
 * @param {object} res : response of updated Views.
 * @return {object} : updated Views. {status, message, data}
 */
const partialUpdateViews = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body };
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(Views, query, dataToUpdate);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : deactivate document of Views from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains updated document of Views.
 * @return {object} : deactivated Views. {status, message, data}
 */
const softDeleteViews = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(Views, query, { isDeleted: true });
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : deactivate multiple documents of Views from table by ids;
 * @param {object} req : request including array of ids in request body.
 * @param {object} res : response contains updated documents of Views.
 * @return {object} : number of deactivated documents of Views. {status, message, data}
 */
const softDeleteManyViews = async (req, res) => {
  try {
    if (!req.body || !req.body.ids) {
      return res.badRequest();
    }
    const query = { _id: { $in: req.body.ids } };
    const result = await dbService.bulkUpdate(Views, query, { isDeleted: true });
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : delete document of Views from table.
 * @param {object} req : request including id as req param.
 * @param {object} res : response contains deleted document.
 * @return {object} : deleted Views. {status, message, data}
 */
const deleteViews = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndDeleteDocument(Views, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : delete documents of Views in table by using ids.
 * @param {object} req : request including array of ids in request body.
 * @param {object} res : response contains no of documents deleted.
 * @return {object} : no of documents deleted. {status, message, data}
 */
const deleteManyViews = async (req, res) => {
  try {
    if (!req.body || !req.body.ids) {
      return res.badRequest();
    }
    const query = { _id: { $in: req.body.ids } };
    const result = await dbService.deleteMany(Views, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  addViews,
  findAllViews,
  getViews,
  getViewsCount,
  updateViews,
  partialUpdateViews,
  softDeleteViews,
  softDeleteManyViews,
  deleteViews,
  deleteManyViews,
};
