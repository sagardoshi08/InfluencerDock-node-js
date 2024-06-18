/**
 * common.js
 * @description: exports helper methods for project.
 */

const mongoose = require('mongoose');
const UserRole = require('../model/userRole');
const RouteRole = require('../model/routeRole');
const dbService = require('./dbService');

/**
 * convertObjectToEnum : converts object to enum
 * @param {object} object : object to be converted
 * @return {array} : converted array
 */
function convertObjectToEnum (object) {
  const enumArr = [];
  Object.values(object).map((val) => enumArr.push(val));
  return enumArr;
}

/**
 * randomNumber : generate random numbers for given length
 * @param {number} length : length of random number to be generated (default 4)
 * @return {number} : generated random number
 */
function randomNumber (length = 4) {
  const numbers = '12345678901234567890';
  let result = '';
  for (let i = length; i > 0; i -= 1) {
    result += numbers[Math.round(Math.random() * (numbers.length - 1))];
  }
  return result;
}

/**
 * replaceAll: find and replace all occurrence of a string in a searched string
 * @param {string} string  : string to be replace
 * @param {string} search  : string which you want to replace
 * @param {string} replace : string with which you want to replace a string
 * @return {string} : replaced new string
 */
function replaceAll (string, search, replace) {
  return string.split(search).join(replace);
}

/**
 * uniqueValidation: check unique validation while user registration
 * @param {object} model : mongoose model instance of collection
 * @param {object} data : data, coming from request
 * @return {boolean} : validation status
 */
async function uniqueValidation (Model, data) {
  let filter = {};
  if (data && data.email && data.username) {
    filter = { $or: [{ username: data.username }, { email: data.email }] };
  }
  filter.isActive = true;
  filter.isDeleted = false;
  const found = await dbService.getDocumentByQuery(Model, filter);
  if (found) {
    return false;
  }
  return true;
}

function getKeyByValue (obj, value) {
  return Object.keys(obj).find((key) => obj[key] === value) || null; // or undefined if the key is not found
}

/**
 * getDifferenceOfTwoDatesInTime : get difference between two dates in time
 * @param {date} currentDate  : current date
 * @param {date} toDate  : future date
 * @return {string} : difference of two date in time
 */
function getDifferenceOfTwoDatesInTime (currentDate, toDate) {
  const hours = toDate.diff(currentDate, 'hour');
  currentDate = currentDate.add(hours, 'hour');
  const minutes = toDate.diff(currentDate, 'minute');
  currentDate = currentDate.add(minutes, 'minute');
  const seconds = toDate.diff(currentDate, 'second');
  currentDate = currentDate.add(seconds, 'second');
  if (hours) {
    return `${hours} hour, ${minutes} minute and ${seconds} second`;
  }
  return `${minutes} minute and ${seconds} second`;
}

/**
 * getRoleAccessData: returns role access of User
 * @param {objectId} userId : id of user to find role data
 * @return {object} : role access of user for APIs of model
 */
async function getRoleAccessData (userId) {
  const userRole = await dbService.getAllDocuments(UserRole, { userId }, { pagination: false });
  const routeRole = await dbService.getAllDocuments(RouteRole, { roleId: { $in: userRole.data ? userRole.data.map((u) => u.roleId) : [] } }, {
    pagination: false,
    populate: ['roleId', 'routeId'],
  });
  const models = mongoose.modelNames();
  const Roles = routeRole.data ? routeRole.data.map((rr) => rr.roleId && rr.roleId.name).filter((value, index, self) => self.indexOf(value) === index) : [];
  const roleAccess = {};
  if (Roles.length) {
    Roles.map((role) => {
      roleAccess[role] = {};
      models.forEach((model) => {
        if (routeRole.data && routeRole.data.length) {
          routeRole.data.map((rr) => {
            if (rr.routeId && rr.routeId.uri.includes(`/${model.toLowerCase()}/`) && rr.roleId && rr.roleId.name === role) {
              if (!roleAccess[role][model]) {
                roleAccess[role][model] = [];
              }
              if (rr.routeId.uri.includes('create') && !roleAccess[role][model].includes('C')) {
                roleAccess[role][model].push('C');
              } else if (rr.routeId.uri.includes('list') && !roleAccess[role][model].includes('R')) {
                roleAccess[role][model].push('R');
              } else if (rr.routeId.uri.includes('update') && !roleAccess[role][model].includes('U')) {
                roleAccess[role][model].push('U');
              } else if (rr.routeId.uri.includes('delete') && !roleAccess[role][model].includes('D')) {
                roleAccess[role][model].push('D');
              }
            }
          });
        }
      });
    });
  }
  return roleAccess;
}

module.exports = {
  convertObjectToEnum,
  randomNumber,
  replaceAll,
  uniqueValidation,
  getDifferenceOfTwoDatesInTime,
  getRoleAccessData,
  getKeyByValue,
};
