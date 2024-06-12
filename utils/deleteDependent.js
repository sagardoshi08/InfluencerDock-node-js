/**
 * deleteDependent.js
 * @description :: exports deleteDependent service for project.
 */

const User = require('../model/user');
const UserTokens = require('../model/userTokens');
const Role = require('../model/role');
const ProjectRoute = require('../model/projectRoute');
const RouteRole = require('../model/routeRole');
const UserRole = require('../model/userRole');
const dbService = require('./dbService');

const deleteUser = async (filter) => {
  try {
    let user = await User.find(filter, { _id: 1 });
    if (user.length) {
      user = user.map((obj) => obj._id);
      const userTokensFilter2769 = { userId: { $in: user } };
      const userTokens9284 = await deleteUserTokens(userTokensFilter2769);
      const userRoleFilter2057 = { userId: { $in: user } };
      const userRole2385 = await deleteUserRole(userRoleFilter2057);
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
      const routeRoleFilter3155 = { roleId: { $in: role } };
      const routeRole4860 = await deleteRouteRole(routeRoleFilter3155);
      const userRoleFilter6869 = { roleId: { $in: role } };
      const userRole8268 = await deleteUserRole(userRoleFilter6869);
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
      const routeRoleFilter3663 = { routeId: { $in: projectroute } };
      const routeRole9731 = await deleteRouteRole(routeRoleFilter3663);
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

const countUser = async (filter) => {
  try {
    let user = await User.find(filter, { _id: 1 });
    if (user.length) {
      user = user.map((obj) => obj._id);
      const userTokensFilter0036 = { userId: { $in: user } };
      const userTokens1138Cnt = await countUserTokens(userTokensFilter0036);
      const userRoleFilter0729 = { userId: { $in: user } };
      const userRole4752Cnt = await countUserRole(userRoleFilter0729);
      const userCnt = await User.countDocuments(filter);
      let response = { user: userCnt };
      response = {
        ...response,
        ...userTokens1138Cnt,
        ...userRole4752Cnt,
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
      const routeRoleFilter1171 = { roleId: { $in: role } };
      const routeRole8108Cnt = await countRouteRole(routeRoleFilter1171);
      const userRoleFilter3902 = { roleId: { $in: role } };
      const userRole4989Cnt = await countUserRole(userRoleFilter3902);
      const roleCnt = await Role.countDocuments(filter);
      let response = { role: roleCnt };
      response = {
        ...response,
        ...routeRole8108Cnt,
        ...userRole4989Cnt,
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
      const routeRoleFilter2549 = { routeId: { $in: projectroute } };
      const routeRole7314Cnt = await countRouteRole(routeRoleFilter2549);
      const projectRouteCnt = await ProjectRoute.countDocuments(filter);
      let response = { projectRoute: projectRouteCnt };
      response = {
        ...response,
        ...routeRole7314Cnt,
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

const softDeleteUser = async (filter, loggedInUser) => {
  try {
    let user = await User.find(filter, { _id: 1 });
    if (user.length) {
      user = user.map((obj) => obj._id);
      const userTokensFilter6639 = { userId: { $in: user } };
      const userTokens2934 = await softDeleteUserTokens(userTokensFilter6639);
      const userRoleFilter7628 = { userId: { $in: user } };
      const userRole3487 = await softDeleteUserRole(userRoleFilter7628);
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
      const routeRoleFilter7991 = { roleId: { $in: role } };
      const routeRole4677 = await softDeleteRouteRole(routeRoleFilter7991);
      const userRoleFilter7961 = { roleId: { $in: role } };
      const userRole0984 = await softDeleteUserRole(userRoleFilter7961);
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
      const routeRoleFilter8157 = { routeId: { $in: projectroute } };
      const routeRole9668 = await softDeleteRouteRole(routeRoleFilter8157);
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
  deleteUser,
  deleteUserTokens,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countUser,
  countUserTokens,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteUser,
  softDeleteUserTokens,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};
