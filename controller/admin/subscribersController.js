const Subscribers = require('../../model/subscribers');
const dbService = require('../../utils/dbService');

/**
 * @description : find all documents of Subscribers from collection based on query and options.
 * @param {object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {object} res : response contains data found from collection.
 * @return {object} : found Subscribers(s). {status, message, data}
 */
const findAllSubscribers = async (req, res) => {
  try {
    const query = req.body && req.body.query ? { ...req.body.query } : {};
    const options = req.body && req.body.options ? { ...req.body.options } : {};
    if (req.body.isCountOnly) {
      const totalRecords = await dbService.countDocument(Subscribers, query);
      return res.success({ data: { totalRecords } });
    }

    const result = await dbService.getAllDocuments(Subscribers, query, options);
    if (result && result.data && result.data.length) {
      return res.success({ data: result });
    }
    return res.recordNotFound();
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : find document of Subscribers from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains document retrieved from table.
 * @return {object} : found Subscribers. {status, message, data}
 */
const getSubscribers = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.getDocumentByQuery(Subscribers, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : returns total number of documents of Subscribers.
 * @param {object} req : request including where object to apply filters in req body
 * @param {object} res : response that returns total number of documents.
 * @return {object} : number of documents. {status, message, data}
 */
const getSubscribersCount = async (req, res) => {
  try {
    const where = req.body && req.body.where ? { ...req.body.where } : {};
    const totalRecords = await dbService.countDocument(Subscribers, where);
    return res.success({ data: { totalRecords } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : deactivate document of Subscribers from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains updated document of Subscribers.
 * @return {object} : deactivated Subscribers. {status, message, data}
 */
const softDeleteSubscribers = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(Subscribers, query, { isDeleted: true });
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : deactivate multiple documents of Subscribers from table by ids;
 * @param {object} req : request including array of ids in request body.
 * @param {object} res : response contains updated documents of Subscribers.
 * @return {object} : number of deactivated documents of Subscribers. {status, message, data}
 */
const softDeleteManySubscribers = async (req, res) => {
  try {
    if (!req.body || !req.body.ids) {
      return res.badRequest();
    }
    const query = { _id: { $in: req.body.ids } };
    const result = await dbService.bulkUpdate(Subscribers, query, {
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
 * @description : delete document of Subscribers from table.
 * @param {object} req : request including id as req param.
 * @param {object} res : response contains deleted document.
 * @return {object} : deleted Subscribers. {status, message, data}
 */
const deleteSubscribers = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndDeleteDocument(Subscribers, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : delete documents of Subscribers in table by using ids.
 * @param {object} req : request including array of ids in request body.
 * @param {object} res : response contains no of documents deleted.
 * @return {object} : no of documents deleted. {status, message, data}
 */
const deleteManySubscribers = async (req, res) => {
  try {
    if (!req.body || !req.body.ids) {
      return res.badRequest();
    }
    const query = { _id: { $in: req.body.ids } };
    const result = await dbService.deleteMany(Subscribers, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  findAllSubscribers,
  getSubscribers,
  getSubscribersCount,
  softDeleteSubscribers,
  softDeleteManySubscribers,
  deleteSubscribers,
  deleteManySubscribers,
};
