const uuid = require('uuid').v4;
const fs = require('fs');
const path = require('path');
const User = require('../../model/user');
const userSchemaKey = require('../../utils/validation/userValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const auth = require('../../services/auth');

const defaultDirectory = 'public/assets/';

/**
 * @description : create document of User in mongodb collection.
 * @param {object} req : request including body for creating document.
 * @param {object} res : response of created document
 * @return {object} : created User. {status, message, data}
 */
const addUser = async (req, res) => {
  try {
    let dataToCreate = { ...req.body || {} };
    const validateRequest = validation.validateParamsWithJoi(dataToCreate, userSchemaKey.schemaKeys);
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    dataToCreate.addedBy = req.user.id;
    dataToCreate = new User(dataToCreate);
    const result = await dbService.createDocument(User, dataToCreate);
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
 * @description : update document of User with data by id.
 * @param {object} req : request including id in request params and data in request body.
 * @param {object} res : response of updated User.
 * @return {object} : updated User. {status, message, data}
 */
const updateUser = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body };
    const validateRequest = validation.validateParamsWithJoi(
      dataToUpdate,
      userSchemaKey.updateSchemaKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    delete dataToUpdate.addedBy;
    dataToUpdate.updatedBy = req.user.id;
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(User, query, dataToUpdate);
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
 * @description : partially update document of User with data by id;
 * @param {object} req : request including id in request params and data in request body.
 * @param {object} res : response of updated User.
 * @return {object} : updated User. {status, message, data}
 */
const partialUpdateUser = async (req, res) => {
  try {
    const dataToUpdate = { ...req.body };
    delete dataToUpdate.addedBy;
    dataToUpdate.updatedBy = req.user.id;
    const query = { _id: req.params.id };
    const result = await dbService.findOneAndUpdateDocument(User, query, dataToUpdate);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : find all documents of User from collection based on query and options.
 * @param {object} req : request including option and query. {query, options : {page, limit, pagination, populate}, isCountOnly}
 * @param {object} res : response contains data found from collection.
 * @return {object} : found User(s). {status, message, data}
 */
const findAllUser = async (req, res) => {
  try {
    const query = req.body && req.body.query ? { ...req.body.query } : {};
    const options = req.body && req.body.options ? { ...req.body.options } : {};
    if (req.body.isCountOnly) {
      const totalRecords = await dbService.countDocument(User, query);
      return res.success({ data: { totalRecords } });
    }

    const result = await dbService.getAllDocuments(User, query, options);
    if (result && result.data && result.data.length) {
      return res.success({ data: result });
    }
    return res.recordNotFound();
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : find document of User from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains document retrieved from table.
 * @return {object} : found User. {status, message, data}
 */
const getUser = async (req, res) => {
  try {
    if (!req.params.username) {
      return res.badRequest();
    }
    const query = { username: req.params.username };
    const result = await dbService.getDocumentByQuery(User, query);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : returns total number of documents of User.
 * @param {object} req : request including where object to apply filters in req body
 * @param {object} res : response that returns total number of documents.
 * @return {object} : number of documents. {status, message, data}
 */
const getUserCount = async (req, res) => {
  try {
    const where = req.body && req.body.where ? { ...req.body.where } : {};
    const totalRecords = await dbService.countDocument(User, where);
    return res.success({ data: { totalRecords } });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : change password
 * @param {object} req : request including user credentials.
 * @param {object} res : response contains updated user document.
 * @return {object} : updated user document {status, message, data}
 */
const changePassword = async (req, res) => {
  try {
    const params = req.body;
    if (!params.newPassword || !params.oldPassword) {
      return res.validationError({ message: 'Please Provide new Password and Old password' });
    }
    const result = await auth.changePassword({
      ...params,
      userId: req.user.id,
    });
    if (result.flag) {
      return res.failure({ message: result.data });
    }
    return res.success({ message: result.data });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

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
 * @description : update user profile.
 * @param {object} req : request including user profile details to update in request body.
 * @param {object} res : updated user document.
 * @return {object} : updated user document. {status, message, data}
 */

const updateProfile = async (req, res) => {
  try {
    const profileData = { ...req.body };
    const validateRequest = validation.validateParamsWithJoi(
      profileData,
      userSchemaKey.updateSchemaKeys,
    );
    if (!validateRequest.isValid) {
      return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
    }
    delete profileData.password;
    delete profileData.createdAt;
    delete profileData.updatedAt;
    delete profileData.id;

    if (profileData.avatar && profileData.avatar !== '') {
      // Avatar Image

      const base64Image = profileData.avatar;
      // Remove header
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const avatarUrl = await saveImage(buffer, 'avatar');
      // Save image to server
      profileData.avatar = avatarUrl;
    }

    if (profileData.coverImage && profileData.coverImage !== '') {
      // Avatar Image

      const base64Image = profileData.coverImage;
      // Remove header
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      const coverUrl = await saveImage(buffer, 'cover');
      // Save image to server
      profileData.coverImage = coverUrl;
    }

    const result = await dbService.findOneAndUpdateDocument(User, { _id: req.user.id }, profileData);
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
 * @description : get information of logged-in User.
 * @param {Object} req : authentication token is required
 * @param {Object} res : Logged-in user information
 * @return {Object} : Logged-in user information {status, message, data}
 */
const getLoggedInUserInfo = async (req, res) => {
  try {
    const query = {
      _id: req.user.id,
      isDeleted: false,
      isActive: true,
    };
    const foundUser = await dbService.getDocumentByQuery(User, query);
    if (!foundUser) {
      return res.recordNotFound();
    }
    return res.success({ data: foundUser });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

/**
 * @description : find document of User from table by id;
 * @param {object} req : request including id in request params.
 * @param {object} res : response contains document retrieved from table.
 * @return {object} : found User. {status, message, data}
 */
const getPopularUserLocation = async (req, res) => {
  try {
    const aggregateArry = [
      {
        $match: {
          role: 1,
          isActive: true,
          city: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$city',
          count: { $sum: 1 },
          latitude: { $first: '$latitude' },
          longitude: { $first: '$longitude' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ];
    const result = await dbService.aggregateDocument(User, aggregateArry);
    if (!result) {
      return res.recordNotFound();
    }
    return res.success({ data: result });
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  addUser,
  updateUser,
  partialUpdateUser,
  findAllUser,
  getUser,
  getUserCount,
  changePassword,
  updateProfile,
  getLoggedInUserInfo,
  getPopularUserLocation,
};
