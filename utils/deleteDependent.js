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
      const userTokensFilter5165 = { userId: { $in: user } };
      const userTokens6554 = await deleteUserTokens(userTokensFilter5165);
      const userRoleFilter1332 = { userId: { $in: user } };
      const userRole2702 = await deleteUserRole(userRoleFilter1332);
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
      const routeRoleFilter4082 = { roleId: { $in: role } };
      const routeRole3769 = await deleteRouteRole(routeRoleFilter4082);
      const userRoleFilter7310 = { roleId: { $in: role } };
      const userRole9522 = await deleteUserRole(userRoleFilter7310);
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
      const routeRoleFilter7441 = { routeId: { $in: projectroute } };
      const routeRole9836 = await deleteRouteRole(routeRoleFilter7441);
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
      const userTokensFilter5706 = { userId: { $in: user } };
      const userTokens3805Cnt = await countUserTokens(userTokensFilter5706);
      const userRoleFilter2796 = { userId: { $in: user } };
      const userRole6594Cnt = await countUserRole(userRoleFilter2796);
      const userCnt = await User.countDocuments(filter);
      let response = { user: userCnt };
      response = {
        ...response,
        ...userTokens3805Cnt,
        ...userRole6594Cnt,
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
      const routeRoleFilter6309 = { roleId: { $in: role } };
      const routeRole9396Cnt = await countRouteRole(routeRoleFilter6309);
      const userRoleFilter7656 = { roleId: { $in: role } };
      const userRole8225Cnt = await countUserRole(userRoleFilter7656);
      const roleCnt = await Role.countDocuments(filter);
      let response = { role: roleCnt };
      response = {
        ...response,
        ...routeRole9396Cnt,
        ...userRole8225Cnt,
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
      const routeRoleFilter3332 = { routeId: { $in: projectroute } };
      const routeRole2637Cnt = await countRouteRole(routeRoleFilter3332);
      const projectRouteCnt = await ProjectRoute.countDocuments(filter);
      let response = { projectRoute: projectRouteCnt };
      response = {
        ...response,
        ...routeRole2637Cnt,
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
      const userTokensFilter8686 = { userId: { $in: user } };
      const userTokens5107 = await softDeleteUserTokens(userTokensFilter8686);
      const userRoleFilter2563 = { userId: { $in: user } };
      const userRole3637 = await softDeleteUserRole(userRoleFilter2563);
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
      const routeRoleFilter1326 = { roleId: { $in: role } };
      const routeRole3855 = await softDeleteRouteRole(routeRoleFilter1326);
      const userRoleFilter9763 = { roleId: { $in: role } };
      const userRole7065 = await softDeleteUserRole(userRoleFilter9763);
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
      const routeRoleFilter9457 = { routeId: { $in: projectroute } };
      const routeRole2173 = await softDeleteRouteRole(routeRoleFilter9457);
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
