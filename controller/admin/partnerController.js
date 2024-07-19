const uuid = require('uuid').v4;
const fs = require('fs');
const path = require('path');
const Partner = require('../../model/partner');
const partnerSchemaKey = require('../../utils/validation/partnerValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');

const defaultDirectory = 'public/assets/';



/**
 * @description : create directory to specified path
 * @param {string} directoryPath : location where directory will be created
 * @return {boolean} : returns true if directory is created or false
 */
const makeDirectory = async (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    fs.promises.mkdir(directoryPath, { recursive: true }, (err) => {
      if (err) {
        return false;
      }
      return true;
    });
  }
  return true;
};

const saveImage = async (buffer, directory) => {
  try {
    await makeDirectory(`${defaultDirectory}${directory}`);

    // Generate a unique filename
    const filename = `${uuid()}.jpg`; // You can use any extension
    // Path to save image
    const imagePath = path.join(defaultDirectory, directory, filename);

    await fs.promises.writeFile(imagePath, buffer);
    return `${process.env.API_PLATFORM_URL}/assets/${directory}/${filename}`;
  } catch (error) {
    console.error('Error saving the image:', error);
    throw error; // Propagate the error back to the caller
  }
};

/**
 * @description : create document of Partner in mongodb collection.
 * @param {object} req : request including body for creating document.
 * @param {object} res : response of created document
 * @return {object} : created Partner. {status, message, data}
 */
const addPartner = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    const validateRequest = validation.validateParamsWithJoi(dataToCreate, partnerSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    if (dataToCreate.image && dataToCreate.image !== '') {
      // Partner Image

      const base64Image = dataToCreate.image;
      // Remove header
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const partnerUrl = await saveImage(buffer, 'partner');
      // Save image to server
      dataToCreate.image = partnerUrl;
    }

    dataToCreate = new Partner(dataToCreate);
    const result = await dbService.createDocument(Partner, dataToCreate);
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
 * @description : find all documents of Partner from collection based on query and options.
 * @param {object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {object} res : response contains data found from collection.
 * @return {object} : found Partner(s). {status, message, data}
 */
const findAllPartner = async (req, res) => {
  try {
    const query = req.body && req.body.query ? { ...req.body.query } : {};
    const options = req.body && req.body.options ? { ...req.body.options } : {};
    if (req.body.isCountOnly) {
      const totalRecords = await dbService.countDocument(Partner, query);
      return res.success({ data: { totalRecords } });
    }

    const result = await dbService.getAllDocuments(Partner, query, options);
    if (result && result.data && result.data.length) {
      return res.success({ data: result });
    }
    return res.recordNotFound();
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : find document of Partner from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains document retrieved from table.
 * @return {object} : found Partner. {status, message, data}
 */
const getPartner = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.getDocumentByQuery(Partner, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : returns total number of documents of Partner.
 * @param {object} req : request including where object to apply filters in req body
 * @param {object} res : response that returns total number of documents.
 * @return {object} : number of documents. {status, message, data}
 */
const getPartnerCount = async (req, res) => {
  try {
    const where = req.body && req.body.where ? { ...req.body.where } : {};
    const totalRecords = await dbService.countDocument(Partner, where);
    return res.success({ data: { totalRecords } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : update document of Partner with data by id.
 * @param {object} req : request including id in request params and data in request body.
 * @param {object} res : response of updated Partner.
 * @return {object} : updated Partner. {status, message, data}
 */
const updatePartner = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body };
    const validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      partnerSchemaKey.updateSchemaKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    delete dataToUpdate.addedBy;

    if (dataToUpdate.image && dataToUpdate.image !== '') {
      // Partner Image

      const base64Image = dataToUpdate.image;
      // Remove header
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const partnerUrl = await saveImage(buffer, 'partner');
      // Save image to server
      dataToUpdate.image = partnerUrl;
    }

    dataToUpdate.updatedBy = req.user.id;
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(Partner, query, dataToUpdate);
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
 * @description : partially update document of Partner with data by id;
 * @param {object} req : request including id in request params and data in request body.
 * @param {object} res : response of updated Partner.
 * @return {object} : updated Partner. {status, message, data}
 */
const partialUpdatePartner = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body };
    delete dataToUpdate.addedBy;
    dataToUpdate.updatedBy = req.user.id;
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(Partner, query, dataToUpdate);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : deactivate document of Partner from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains updated document of Partner.
 * @return {object} : deactivated Partner. {status, message, data}
 */
const softDeletePartner = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(Partner, query, { isDeleted: true });
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : deactivate multiple documents of Partner from table by ids;
 * @param {object} req : request including array of ids in request body.
 * @param {object} res : response contains updated documents of Partner.
 * @return {object} : number of deactivated documents of Partner. {status, message, data}
 */
const softDeleteManyPartner = async (req, res) => {
  try {
    if (!req.body || !req.body.ids) {
      return res.badRequest();
    }
    const query = { _id: { $in: req.body.ids } };
    const result = await dbService.bulkUpdate(Partner, query, {
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
 * @description : delete document of Partner from table.
 * @param {object} req : request including id as req param.
 * @param {object} res : response contains deleted document.
 * @return {object} : deleted Partner. {status, message, data}
 */
const deletePartner = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.badRequest();
    }
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndDeleteDocument(Partner, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : delete documents of Partner in table by using ids.
 * @param {object} req : request including array of ids in request body.
 * @param {object} res : response contains no of documents deleted.
 * @return {object} : no of documents deleted. {status, message, data}
 */
const deleteManyPartner = async (req, res) => {
  try {
    if (!req.body || !req.body.ids) {
      return res.badRequest();
    }
    const query = { _id: { $in: req.body.ids } };
    const result = await dbService.deleteMany(Partner, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  addPartner,
  findAllPartner,
  getPartner,
  getPartnerCount,
  updatePartner,
  partialUpdatePartner,
  softDeletePartner,
  softDeleteManyPartner,
  deletePartner,
  deleteManyPartner,
};
