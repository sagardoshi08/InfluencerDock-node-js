const Role = require('../../model/role');
const roleSchemaKey = require('../../utils/validation/roleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const deleteDependentService = require('../../utils/deleteDependent');

/**
 * @description : create document of Role in mongodb collection.
 * @param {object} req : request including body for creating document.
 * @param {object} res : response of created document
 * @return {object} : created Role. {status, message, data}
 */
const addRole = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    const validateRequest = validation.validateParamsWithJoi(dataToCreate, roleSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new Role(dataToCreate);
    const result = await dbService.createDocument(Role, dataToCreate);
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
 * @description : create multiple documents of Role in mongodb collection.
 * @param {object} req : request including body for creating documents.
 * @param {object} res : response of created documents.
 * @return {object} : created Roles. {status, message, data}
 */
const bulkInsertRole = async (req, res) => {
  try {
    const dataToCreate = req.body && req.body.data ? [...req.body.data] : [];
    for (let i = 0; i < dataToCreate.length; i++) {
      dataToCreate[i].addedBy = req.user.id;
    }
    const result = await dbService.bulkInsert(Role, dataToCreate);
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
 * @description : find all documents of Role from collection based on query and options.
 * @param {object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {object} res : response contains data found from collection.
 * @return {object} : found Role(s). {status, message, data}
 */
const findAllRole = async (req, res) => {
  try {
    const query = req.body && req.body.query ? { ...req.body.query } : {};
    const options = req.body && req.body.options ? { ...req.body.options } : {};
    if (req.body.isCountOnly) {
      const totalRecords = await dbService.countDocument(Role, query);
      return res.success({ data: { totalRecords } });
    }

    const result = await dbService.getAllDocuments(Role, query, options);
    if (result && result.data && result.data.length) {
      return res.success({ data: result });
    }
    return res.recordNotFound();
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : find document of Role from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains document retrieved from table.
 * @return {object} : found Role. {status, message, data}
 */
const getRole = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.getDocumentByQuery(Role, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : partially update document of Role with data by id;
 * @param {object} req : request including id in request params and data in request body.
 * @param {object} res : response of updated Role.
 * @return {object} : updated Role. {status, message, data}
 */
const partialUpdateRole = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body };
    delete dataToUpdate.addedBy;
    dataToUpdate.updatedBy = req.user.id;
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(Role, query, dataToUpdate);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : deactivate document of Role from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains updated document of Role.
 * @return {object} : deactivated Role. {status, message, data}
 */
const softDeleteRole = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await deleteDependentService.softDeleteRole(query, req.user);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};
/**
 * @description : update document of Role with data by id.
 * @param {object} req : request including id in request params and data in request body.
 * @param {object} res : response of updated Role.
 * @return {object} : updated Role. {status, message, data}
 */
const updateRole = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body };
    const validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      roleSchemaKey.updateSchemaKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    delete dataToUpdate.addedBy;
    dataToUpdate.updatedBy = req.user.id;
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(Role, query, dataToUpdate);
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
 * @description : returns total number of documents of Role.
 * @param {object} req : request including where object to apply filters in req body
 * @param {object} res : response that returns total number of documents.
 * @return {object} : number of documents. {status, message, data}
 */
const getRoleCount = async (req, res) => {
  try {
    const where = req.body && req.body.where ? { ...req.body.where } : {};
    const totalRecords = await dbService.countDocument(Role, where);
    return res.success({ data: { totalRecords } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : update multiple records of Role with data by filter.
 * @param {object} req : request including filter and data in request body.
 * @param {object} res : response of updated Roles.
 * @return {object} : updated Roles. {status, message, data}
 */
const bulkUpdateRole = async (req, res) => {
  try {
    const filter = req.body && req.body.filter ? { ...req.body.filter } : {};
    const dataToUpdate = req.body && req.body.data ? { ...req.body.data } : {};
    dataToUpdate.updatedBy = req.user.id;
    const result = await dbService.bulkUpdate(Role, filter, dataToUpdate);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  addRole,
  bulkInsertRole,
  findAllRole,
  getRole,
  partialUpdateRole,
  softDeleteRole,
  updateRole,
  getRoleCount,
  bulkUpdateRole,
};
