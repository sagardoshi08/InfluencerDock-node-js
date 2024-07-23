const MyFavourites = require('../../model/myFavourites');
const myFavouritesSchemaKey = require('../../utils/validation/myFavouritesValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');

/**
 * @description : create document of MyFavourites in mongodb collection.
 * @param {object} req : request including body for creating document.
 * @param {object} res : response of created document
 * @return {object} : created MyFavourites. {status, message, data}
 */
const addMyFavourites = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    const validateRequest = validation.validateParamsWithJoi(dataToCreate, myFavouritesSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new MyFavourites(dataToCreate);
    const result = await dbService.createDocument(MyFavourites, dataToCreate);
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
 * @description : find all documents of MyFavourites from collection based on query and options.
 * @param {object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {object} res : response contains data found from collection.
 * @return {object} : found MyFavourites(s). {status, message, data}
 */
const findAllMyFavourites = async (req, res) => {
  try {
    const query = req.body && req.body.query ? { ...req.body.query } : {};
    const options = req.body && req.body.options ? { ...req.body.options } : {};
    if (req.body.isCountOnly) {
      const totalRecords = await dbService.countDocument(MyFavourites, query);
      return res.success({ data: { totalRecords } });
    }

    const result = await dbService.getAllDocuments(MyFavourites, query, options);
    if (result && result.data && result.data.length) {
      return res.success({ data: result });
    }
    return res.recordNotFound();
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : find document of MyFavourites from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains document retrieved from table.
 * @return {object} : found MyFavourites. {status, message, data}
 */
const getMyFavourites = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.getDocumentByQuery(MyFavourites, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : returns total number of documents of MyFavourites.
 * @param {object} req : request including where object to apply filters in req body
 * @param {object} res : response that returns total number of documents.
 * @return {object} : number of documents. {status, message, data}
 */
const getMyFavouritesCount = async (req, res) => {
  try {
    const where = req.body && req.body.where ? { ...req.body.where } : {};
    const totalRecords = await dbService.countDocument(MyFavourites, where);
    return res.success({ data: { totalRecords } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : delete document of MyFavourites from table.
 * @param {object} req : request including id as req param.
 * @param {object} res : response contains deleted document.
 * @return {object} : deleted MyFavourites. {status, message, data}
 */
const deleteMyFavourites = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndDeleteDocument(MyFavourites, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : delete documents of MyFavourites in table by using ids.
 * @param {object} req : request including array of ids in request body.
 * @param {object} res : response contains no of documents deleted.
 * @return {object} : no of documents deleted. {status, message, data}
 */
const deleteManyMyFavourites = async (req, res) => {
  try {
    if (!req.body || !req.body.ids) {
      return res.badRequest();
    }
    const query = { _id: { $in: req.body.ids } };
    const result = await dbService.deleteMany(MyFavourites, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : deactivate document of MyFavourites from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains updated document of MyFavourites.
 * @return {object} : deactivated MyFavourites. {status, message, data}
 */
const softDeleteMyFavourites = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(MyFavourites, query, { isDeleted: true });
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : deactivate multiple documents of MyFavourites from table by ids;
 * @param {object} req : request including array of ids in request body.
 * @param {object} res : response contains updated documents of MyFavourites.
 * @return {object} : number of deactivated documents of MyFavourites. {status, message, data}
 */
const softDeleteManyMyFavourites = async (req, res) => {
  try {
    if (!req.body || !req.body.ids) {
      return res.badRequest();
    }
    const query = { _id: { $in: req.body.ids } };
    const result = await dbService.bulkUpdate(MyFavourites, query, {
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

module.exports = {
  addMyFavourites,
  findAllMyFavourites,
  getMyFavourites,
  getMyFavouritesCount,
  deleteMyFavourites,
  deleteManyMyFavourites,
  softDeleteMyFavourites,
  softDeleteManyMyFavourites,
};
