const RouteRole = require('../../model/routeRole');
const routeRoleSchemaKey = require('../../utils/validation/routeRoleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');

/**
 * @description : create document of RouteRole in mongodb collection.
 * @param {object} req : request including body for creating document.
 * @param {object} res : response of created document
 * @return {object} : created RouteRole. {status, message, data}
 */
const addRouteRole = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    const validateRequest = validation.validateParamsWithJoi(dataToCreate, routeRoleSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new RouteRole(dataToCreate);
    const result = await dbService.createDocument(RouteRole, dataToCreate);
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
 * @description : create multiple documents of RouteRole in mongodb collection.
 * @param {object} req : request including body for creating documents.
 * @param {object} res : response of created documents.
 * @return {object} : created RouteRoles. {status, message, data}
 */
const bulkInsertRouteRole = async (req, res) => {
  try {
    const dataToCreate = req.body && req.body.data ? [...req.body.data] : [];
    for (let i = 0; i < dataToCreate.length; i++) {
      dataToCreate[i].addedBy = req.user.id;
    }
    const result = await dbService.bulkInsert(RouteRole, dataToCreate);
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
 * @description : find all documents of RouteRole from collection based on query and options.
 * @param {object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {object} res : response contains data found from collection.
 * @return {object} : found RouteRole(s). {status, message, data}
 */
const findAllRouteRole = async (req, res) => {
  try {
    const query = req.body && req.body.query ? { ...req.body.query } : {};
    const options = req.body && req.body.options ? { ...req.body.options } : {};
    if (req.body.isCountOnly) {
      const totalRecords = await dbService.countDocument(RouteRole, query);
      return res.success({ data: { totalRecords } });
    }

    const result = await dbService.getAllDocuments(RouteRole, query, options);
    if (result && result.data && result.data.length) {
      return res.success({ data: result });
    }
    return res.recordNotFound();
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : find document of RouteRole from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains document retrieved from table.
 * @return {object} : found RouteRole. {status, message, data}
 */
const getRouteRole = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.getDocumentByQuery(RouteRole, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : partially update document of RouteRole with data by id;
 * @param {object} req : request including id in request params and data in request body.
 * @param {object} res : response of updated RouteRole.
 * @return {object} : updated RouteRole. {status, message, data}
 */
const partialUpdateRouteRole = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body };
    delete dataToUpdate.addedBy;
    dataToUpdate.updatedBy = req.user.id;
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(RouteRole, query, dataToUpdate);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : update document of RouteRole with data by id.
 * @param {object} req : request including id in request params and data in request body.
 * @param {object} res : response of updated RouteRole.
 * @return {object} : updated RouteRole. {status, message, data}
 */
const updateRouteRole = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body };
    const validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      routeRoleSchemaKey.updateSchemaKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    delete dataToUpdate.addedBy;
    dataToUpdate.updatedBy = req.user.id;
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(RouteRole, query, dataToUpdate);
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
 * @description : deactivate document of RouteRole from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains updated document of RouteRole.
 * @return {object} : deactivated RouteRole. {status, message, data}
 */
const softDeleteRouteRole = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(RouteRole, query, { isDeleted: true });
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : returns total number of documents of RouteRole.
 * @param {object} req : request including where object to apply filters in req body
 * @param {object} res : response that returns total number of documents.
 * @return {object} : number of documents. {status, message, data}
 */
const getRouteRoleCount = async (req, res) => {
  try {
    const where = req.body && req.body.where ? { ...req.body.where } : {};
    const totalRecords = await dbService.countDocument(RouteRole, where);
    return res.success({ data: { totalRecords } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : update multiple records of RouteRole with data by filter.
 * @param {object} req : request including filter and data in request body.
 * @param {object} res : response of updated RouteRoles.
 * @return {object} : updated RouteRoles. {status, message, data}
 */
const bulkUpdateRouteRole = async (req, res) => {
  try {
    const filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    const dataToUpdate = req.body && req.body.data ? { ...req.body.data } : {};
    dataToUpdate.updatedBy = req.user.id;
    const result = await dbService.bulkUpdate(RouteRole, filter, dataToUpdate);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  addRouteRole,
  bulkInsertRouteRole,
  findAllRouteRole,
  getRouteRole,
  partialUpdateRouteRole,
  updateRouteRole,
  softDeleteRouteRole,
  getRouteRoleCount,
  bulkUpdateRouteRole,
};
