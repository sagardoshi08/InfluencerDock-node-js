/**
 * fileUploadController.js
 * @description :: exports methods related file upload
 */

const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const validUrl = require('valid-url');

const defaultDirectory = 'public/assets';
const allowedFileTypes = ['pdf'];
const maxFileSize = 50; // In Megabyte

/**
 * @description : uploads file using formidable.
 * @param {object} req : request of file upload API
 * @param {object} res : response of file upload API.
 * @return {object} : response of file upload. {status, message, data}
 */
const upload = async (req, res) => {
  try {
    // Create Directory if not exist.
    await makeDirectory(defaultDirectory);

    // Setting up formidable options.
    const form = new formidable.IncomingForm();
    form.multiples = true;
    form.maxFileSize = 300 * 1024 * 1024; // 300 MB
    form.maxFieldsSize = 100 * 1024 * 1024; // 50 MB

    // Upload File one by one
    const uploadFileRes = await new Promise(async (resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          reject(err);
        }

        const uploadSuccess = [];
        const uploadFailed = [];
        let fileCount = 1;

        const fileArr = [];
        if (!files['file[]']) {
          reject({
            message: 'Select at least one file to upload.',
            name: 'validationError',
          });
        }
        if (!Array.isArray(files['file[]'])) {
          fileArr.push(files['file[]']);
          files['file[]'] = fileArr;
        }

        for (const file of files['file[]']) {
          const response = await uploadFiles(file, fields, fileCount++);

          if (response.status == false) {
            uploadFailed.push({
              name: file.name,
              error: response.message,
              status: false,
            });
          } else {
            let url = response.data;
            if (!validUrl.isUri(response.data)) {
              response.data = response.data.replace('/public', '');
              url = `${response.data}`;
            }
            uploadSuccess.push({
              name: file.name,
              path: url,
              status: true,
            });
          }
        }
        resolve({
          uploadSuccess,
          uploadFailed,
        });
      });
    });

    if (uploadFileRes.uploadSuccess.length > 0) {
      const message = `${uploadFileRes.uploadSuccess.length} File uploaded successfully out of ${uploadFileRes.uploadSuccess.length + uploadFileRes.uploadFailed.length}`;
      return res.success({
        message,
        data: uploadFileRes,
      });
    }
    const message = 'Failed to upload files.';
    return res.failure({
      message,
      data: uploadFileRes,
    });
  } catch (error) {
    if (error.name && error.name == 'validationError') {
      return res.validationError({ message: error.message });
    }
    return res.internalServerError();
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

/**
 * @description : upload files
 * @param {object} file : file to upload
 * @param {object} fields : fields for file
 * @param {number} fileCount : total number of files to upload
 * @return {object} : response for file upload
 */
const uploadFiles = async (file, fields, fileCount) => {
  const tempPath = file.path;
  let unlink;
  let fileName = file.name;

  let extension = path.extname(file.name);
  extension = extension.split('.').pop();

  fileType = file.type;

  if (allowedFileTypes.length) {
    // Check allowed extension;
    if (!allowedFileTypes.includes(extension)) {
      return {
        status: false,
        message: 'Filetype not allowed.',
      };
    }
  }

  // Check File Size
  const fileSize = ((file.size / 1024) / 1024);
  if (maxFileSize < fileSize) {
    return {
      status: false,
      message: `Allow file size upto ${maxFileSize} MB.`,
    };
  }

  // Create New path
  let newPath = `${defaultDirectory}/${new Date().getTime()}${path.extname(file.name)}`;

  // Create Requested Directory,if given in request parameter.
  if (fields && fields.folderName) {
    const newDir = `${defaultDirectory}/${fields.folderName}`;
    const createDir = await makeDirectory(newDir);
    if (createDir) {
      if (fields.fileName) {
        newPath = `${newDir}/${fields.fileName}-${fileCount}${path.extname(file.name)}`;
        fileName = fields.fileName;
      }
    }
  } else if (fields && fields.fileName) {
    newPath = `${defaultDirectory}/${fields.fileName}-${fileCount}${path.extname(file.name)}`;
    fileName = fields.fileName;
  }

  const response = await new Promise(async (resolve, reject) => {
    fs.readFile(tempPath, (err, data) => {
      fs.writeFile(newPath, data, async (err) => {
        // Remove file from temp
        unlink = await unlinkFile(tempPath);

        if (unlink.status == false) {
          reject(unlink);
        } else {
          resolve({
            status: true,
            message: 'File upload successfully.',
            data: `/${newPath}`,
          });
        }
      });
    });
  });

  return response;
};

/**
 * @description : unlink(delete) file from specified path
 * @param {string} path : location of file
 * @return {object} : return unlink file status {status, message}
 */
const unlinkFile = async (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      return {
        status: false,
        message: err.message,
      };
    }
  });

  return { status: true };
};

module.exports = { upload };
