/**
 * deleteDependent.js
 * @description :: exports deleteDependent service for project.
 */

const Contact = require('../model/contact');
const User = require('../model/user');
const UserTokens = require('../model/userTokens');
const Role = require('../model/role');
const ProjectRoute = require('../model/projectRoute');
const RouteRole = require('../model/routeRole');
const UserRole = require('../model/userRole');
const dbService = require('./dbService');

const deleteContact = async (filter) => {
  try {
    return await Contact.deleteMany(filter);
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteUser = async (filter) => {
  try {
    let user = await User.find(filter, { _id: 1 });
    if (user.length) {
      user = user.map((obj) => obj._id);
      const userTokensFilter6643 = { userId: { $in: user } };
      const userTokens3399 = await deleteUserTokens(userTokensFilter6643);
      const userRoleFilter8357 = { userId: { $in: user } };
      const userRole1868 = await deleteUserRole(userRoleFilter8357);
      return await User.deleteMany(filter);
    }
    return 'No user found.';
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteUserTokens = async (filter) => {
  try {
    return await UserTokens.deleteMany(filter);
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) => {
  try {
    let role = await Role.find(filter, { _id: 1 });
    if (role.length) {
      role = role.map((obj) => obj._id);
      const routeRoleFilter4242 = { roleId: { $in: role } };
      const routeRole9891 = await deleteRouteRole(routeRoleFilter4242);
      const userRoleFilter6656 = { roleId: { $in: role } };
      const userRole5536 = await deleteUserRole(userRoleFilter6656);
      return await Role.deleteMany(filter);
    }
    return 'No role found.';
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) => {
  try {
    let projectroute = await ProjectRoute.find(filter, { _id: 1 });
    if (projectroute.length) {
      projectroute = projectroute.map((obj) => obj._id);
      const routeRoleFilter5931 = { routeId: { $in: projectroute } };
      const routeRole2336 = await deleteRouteRole(routeRoleFilter5931);
      return await ProjectRoute.deleteMany(filter);
    }
    return 'No projectRoute found.';
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) => {
  try {
    return await RouteRole.deleteMany(filter);
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) => {
  try {
    return await UserRole.deleteMany(filter);
  } catch (error) {
    throw new Error(error.message);
  }
};

const countContact = async (filter) => {
  try {
    const contactCnt = await Contact.countDocuments(filter);
    return { contact: contactCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const countUser = async (filter) => {
  try {
    let user = await User.find(filter, { _id: 1 });
    if (user.length) {
      user = user.map((obj) => obj._id);
      const userTokensFilter5050 = { userId: { $in: user } };
      const userTokens3469Cnt = await countUserTokens(userTokensFilter5050);
      const userRoleFilter5471 = { userId: { $in: user } };
      const userRole9778Cnt = await countUserRole(userRoleFilter5471);
      const userCnt = await User.countDocuments(filter);
      let response = { user: userCnt };
      response = {
        ...response,
        ...userTokens3469Cnt,
        ...userRole9778Cnt,
      };
      return response;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const countUserTokens = async (filter) => {
  try {
    const userTokensCnt = await UserTokens.countDocuments(filter);
    return { userTokens: userTokensCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const countRole = async (filter) => {
  try {
    let role = await Role.find(filter, { _id: 1 });
    if (role.length) {
      role = role.map((obj) => obj._id);
      const routeRoleFilter8991 = { roleId: { $in: role } };
      const routeRole4414Cnt = await countRouteRole(routeRoleFilter8991);
      const userRoleFilter1222 = { roleId: { $in: role } };
      const userRole7570Cnt = await countUserRole(userRoleFilter1222);
      const roleCnt = await Role.countDocuments(filter);
      let response = { role: roleCnt };
      response = {
        ...response,
        ...routeRole4414Cnt,
        ...userRole7570Cnt,
      };
      return response;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const countProjectRoute = async (filter) => {
  try {
    let projectroute = await ProjectRoute.find(filter, { _id: 1 });
    if (projectroute.length) {
      projectroute = projectroute.map((obj) => obj._id);
      const routeRoleFilter3398 = { routeId: { $in: projectroute } };
      const routeRole2426Cnt = await countRouteRole(routeRoleFilter3398);
      const projectRouteCnt = await ProjectRoute.countDocuments(filter);
      let response = { projectRoute: projectRouteCnt };
      response = {
        ...response,
        ...routeRole2426Cnt,
      };
      return response;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const countRouteRole = async (filter) => {
  try {
    const routeRoleCnt = await RouteRole.countDocuments(filter);
    return { routeRole: routeRoleCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) => {
  try {
    const userRoleCnt = await UserRole.countDocuments(filter);
    return { userRole: userRoleCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteContact = async (filter, loggedInUser) => {
  try {
    if (loggedInUser && loggedInUser.id) {
      return await Contact.updateMany(filter, {
        isDeleted: true,
        updatedBy: loggedInUser.id,
      });
    }
    return await Contact.updateMany(filter, { isDeleted: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter, loggedInUser) => {
  try {
    let user = await User.find(filter, { _id: 1 });
    if (user.length) {
      user = user.map((obj) => obj._id);
      const userTokensFilter0272 = { userId: { $in: user } };
      const userTokens3284 = await softDeleteUserTokens(userTokensFilter0272);
      const userRoleFilter7696 = { userId: { $in: user } };
      const userRole0672 = await softDeleteUserRole(userRoleFilter7696);
      if (loggedInUser && loggedInUser.id) {
        return await User.updateMany(filter, {
          isDeleted: true,
          updatedBy: loggedInUser.id,
        });
      }
      return await User.updateMany(filter, { isDeleted: true });
    }
    return 'No user found.';
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteUserTokens = async (filter, loggedInUser) => {
  try {
    if (loggedInUser && loggedInUser.id) {
      return await UserTokens.updateMany(filter, {
        isDeleted: true,
        updatedBy: loggedInUser.id,
      });
    }
    return await UserTokens.updateMany(filter, { isDeleted: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter, loggedInUser) => {
  try {
    let role = await Role.find(filter, { _id: 1 });
    if (role.length) {
      role = role.map((obj) => obj._id);
      const routeRoleFilter8453 = { roleId: { $in: role } };
      const routeRole5579 = await softDeleteRouteRole(routeRoleFilter8453);
      const userRoleFilter4670 = { roleId: { $in: role } };
      const userRole3902 = await softDeleteUserRole(userRoleFilter4670);
      if (loggedInUser && loggedInUser.id) {
        return await Role.updateMany(filter, {
          isDeleted: true,
          updatedBy: loggedInUser.id,
        });
      }
      return await Role.updateMany(filter, { isDeleted: true });
    }
    return 'No role found.';
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter, loggedInUser) => {
  try {
    let projectroute = await ProjectRoute.find(filter, { _id: 1 });
    if (projectroute.length) {
      projectroute = projectroute.map((obj) => obj._id);
      const routeRoleFilter2329 = { routeId: { $in: projectroute } };
      const routeRole7476 = await softDeleteRouteRole(routeRoleFilter2329);
      if (loggedInUser && loggedInUser.id) {
        return await ProjectRoute.updateMany(filter, {
          isDeleted: true,
          updatedBy: loggedInUser.id,
        });
      }
      return await ProjectRoute.updateMany(filter, { isDeleted: true });
    }
    return 'No projectRoute found.';
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter, loggedInUser) => {
  try {
    if (loggedInUser && loggedInUser.id) {
      return await RouteRole.updateMany(filter, {
        isDeleted: true,
        updatedBy: loggedInUser.id,
      });
    }
    return await RouteRole.updateMany(filter, { isDeleted: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter, loggedInUser) => {
  try {
    if (loggedInUser && loggedInUser.id) {
      return await UserRole.updateMany(filter, {
        isDeleted: true,
        updatedBy: loggedInUser.id,
      });
    }
    return await UserRole.updateMany(filter, { isDeleted: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  deleteContact,
  deleteUser,
  deleteUserTokens,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countContact,
  countUser,
  countUserTokens,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteContact,
  softDeleteUser,
  softDeleteUserTokens,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};
