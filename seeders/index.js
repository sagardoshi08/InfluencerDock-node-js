/* eslint-disable no-unused-vars */
/**
 * seeder.js
 * @description :: functions that seeds mock data to run the application
 */

const bcrypt = require('bcrypt');
const User = require('../model/user');
const authConstant = require('../constants/authConstant');
const Role = require('../model/role');
const ProjectRoute = require('../model/projectRoute');
const RouteRole = require('../model/routeRole');
const UserRole = require('../model/userRole');
const { replaceAll } = require('../utils/common');
const dbService = require('../utils/dbService');

/* seeds default users */
async function seedUser () {
  try {
    let userToBeInserted = {};
    userToBeInserted = {
      password: 'U8IMufLszzHKHCa',
      email: 'sagardoshi72427@gmail.com',
      role: authConstant.USER_ROLE.Admin,
      username: 'sagar1',
    };
    userToBeInserted.password = await bcrypt.hash(userToBeInserted.password, 8);
    const user = await dbService.findOneAndUpdateDocument(User, {
      email: 'sagardoshi72427@gmail.com',
      isActive: true,
      // isDeleted: false,
    }, userToBeInserted, {
      upsert: true,
      new: true,
    });
    userToBeInserted = {
      password: '0z4pekZz1eSVGJj',
      email: 'sagardoshi2020@gmail.com',
      role: authConstant.USER_ROLE.Admin,
      username: 'admin',
    };
    userToBeInserted.password = await bcrypt.hash(userToBeInserted.password, 8);
    const admin = await dbService.findOneAndUpdateDocument(User, {
      email: 'sagardoshi2020@gmail.com',
      isActive: true,
      isDeleted: false,
    }, userToBeInserted, {
      upsert: true,
      new: true,
    });
    console.info('Users seeded 🍺');
  } catch (error) {
    console.log('User seeder failed due to ', error.message);
  }
}
/* seeds roles */
async function seedRole () {
  try {
    const roles = ['User', 'SuperAdmin', 'SYSTEM_USER'];
    const insertedRoles = await dbService.findAllDocuments(Role, { code: { $in: roles.map((role) => role.toUpperCase()) } });
    const rolesToInsert = [];
    roles.forEach((role) => {
      if (!insertedRoles.find((insertedRole) => insertedRole.code === role.toUpperCase())) {
        rolesToInsert.push({
          name: role,
          code: role.toUpperCase(),
          weight: 1,
        });
      }
    });
    if (rolesToInsert.length) {
      const result = await dbService.bulkInsert(Role, rolesToInsert);
      if (result) console.log('Role seeded 🍺');
      else console.log('Role seeder failed!');
    } else {
      console.log('Role is up to date 🍺');
    }
  } catch (error) {
    console.log('Role seeder failed due to ', error.message);
  }
}

/* seeds routes of project */
async function seedProjectRoutes (routes) {
  try {
    if (routes && routes.length) {
      let routeName = '';
      const dbRoutes = await dbService.findAllDocuments(ProjectRoute, {});
      const routeArr = [];
      let routeObj = {};
      routes.forEach((route) => {
        routeName = `${replaceAll((route.path).toLowerCase(), '/', '_')}`;
        route.methods.forEach((method) => {
          routeObj = dbRoutes.find((dbRoute) => dbRoute.route_name === routeName && dbRoute.method === method);
          if (!routeObj) {
            routeArr.push({
              uri: route.path.toLowerCase(),
              method,
              route_name: routeName,
            });
          }
        });
      });
      if (routeArr.length) {
        const result = await dbService.bulkInsert(ProjectRoute, routeArr);
        if (result) console.info('ProjectRoute model seeded 🍺');
        else console.info('ProjectRoute seeder failed.');
      } else {
        console.info('ProjectRoute is up to date 🍺');
      }
    }
  } catch (error) {
    console.log('ProjectRoute seeder failed due to ', error.message);
  }
}

/* seeds role for routes */
async function seedRouteRole () {
  try {
    const routeRoles = [
      {
        route: '/admin/user/create',
        role: 'User',
        method: 'POST',
      },
      {
        route: '/admin/user/create',
        role: 'SuperAdmin',
        method: 'POST',
      },
      {
        route: '/admin/user/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/user/list',
        role: 'User',
        method: 'POST',
      },
      {
        route: '/admin/user/list',
        role: 'SuperAdmin',
        method: 'POST',
      },
      {
        route: '/admin/user/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/user/:id',
        role: 'User',
        method: 'GET',
      },
      {
        route: '/admin/user/:id',
        role: 'SuperAdmin',
        method: 'GET',
      },
      {
        route: '/admin/user/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/admin/user/count',
        role: 'User',
        method: 'POST',
      },
      {
        route: '/admin/user/count',
        role: 'SuperAdmin',
        method: 'POST',
      },
      {
        route: '/admin/user/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/user/update/:id',
        role: 'User',
        method: 'PUT',
      },
      {
        route: '/admin/user/update/:id',
        role: 'SuperAdmin',
        method: 'PUT',
      },
      {
        route: '/admin/user/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'User',
        method: 'PUT',
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'SuperAdmin',
        method: 'PUT',
      },
      {
        route: '/admin/user/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'User',
        method: 'PUT',
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'SuperAdmin',
        method: 'PUT',
      },
      {
        route: '/admin/user/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'User',
        method: 'PUT',
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'SuperAdmin',
        method: 'PUT',
      },
      {
        route: '/admin/user/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/user/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/user/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/user/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/user/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/contact/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/contact/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/contact/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/admin/contact/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/contact/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/contact/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/contact/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/contact/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/contact/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/contact/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/contact/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/contact/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/subscribers/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/subscribers/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/subscribers/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/admin/subscribers/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/subscribers/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/subscribers/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/subscribers/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/subscribers/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/subscribers/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/subscribers/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/subscribers/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/subscribers/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/usertokens/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/usertokens/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/usertokens/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/admin/usertokens/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/usertokens/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/usertokens/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/usertokens/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/usertokens/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/usertokens/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/usertokens/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/usertokens/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/usertokens/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/partner/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/partner/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/partner/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/admin/partner/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/partner/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/partner/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/partner/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/partner/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/partner/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/partner/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/partner/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/partner/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/views/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/views/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/views/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/admin/views/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/views/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/views/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/views/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/views/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/views/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/views/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/views/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/views/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/myfavourites/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/myfavourites/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/myfavourites/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/admin/myfavourites/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/myfavourites/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/myfavourites/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/myfavourites/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/myfavourites/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/myfavourites/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/myfavourites/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/myfavourites/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/chatrelationship/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/chatrelationship/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/chatrelationship/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/admin/chatrelationship/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/chatrelationship/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/chatrelationship/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/chatrelationship/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/chatrelationship/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/chatrelationship/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/chatrelationship/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/admin/chatrelationship/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/admin/chatrelationship/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/admin/myfavourites/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/user/create',
        role: 'User',
        method: 'POST',
      },
      {
        route: '/client/api/v1/user/create',
        role: 'SuperAdmin',
        method: 'POST',
      },
      {
        route: '/client/api/v1/user/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/user/list',
        role: 'User',
        method: 'POST',
      },
      {
        route: '/client/api/v1/user/list',
        role: 'SuperAdmin',
        method: 'POST',
      },
      {
        route: '/client/api/v1/user/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/user/:id',
        role: 'User',
        method: 'GET',
      },
      {
        route: '/client/api/v1/user/:id',
        role: 'SuperAdmin',
        method: 'GET',
      },
      {
        route: '/client/api/v1/user/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/client/api/v1/user/count',
        role: 'User',
        method: 'POST',
      },
      {
        route: '/client/api/v1/user/count',
        role: 'SuperAdmin',
        method: 'POST',
      },
      {
        route: '/client/api/v1/user/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/user/update/:id',
        role: 'User',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/user/update/:id',
        role: 'SuperAdmin',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/user/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/user/partial-update/:id',
        role: 'User',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/user/partial-update/:id',
        role: 'SuperAdmin',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/user/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/user/softdelete/:id',
        role: 'User',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/user/softdelete/:id',
        role: 'SuperAdmin',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/user/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/user/softdeletemany',
        role: 'User',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/user/softdeletemany',
        role: 'SuperAdmin',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/user/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/user/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/user/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/user/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/user/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/contact/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/contact/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/contact/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/client/api/v1/contact/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/contact/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/contact/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/contact/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/contact/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/contact/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/contact/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/contact/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/contact/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/subscribers/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/subscribers/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/subscribers/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/client/api/v1/subscribers/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/subscribers/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/subscribers/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/subscribers/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/subscribers/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/subscribers/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/subscribers/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/subscribers/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/subscribers/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/usertokens/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/usertokens/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/usertokens/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/client/api/v1/usertokens/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/usertokens/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/usertokens/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/usertokens/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/usertokens/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/usertokens/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/usertokens/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/usertokens/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/usertokens/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/partner/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/partner/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/partner/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/client/api/v1/partner/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/partner/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/partner/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/partner/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/partner/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/partner/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/partner/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/partner/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/partner/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/views/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/views/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/views/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/client/api/v1/views/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/views/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/views/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/views/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/views/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/views/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/views/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/views/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/views/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/myfavourites/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/myfavourites/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/myfavourites/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/client/api/v1/myfavourites/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/myfavourites/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/myfavourites/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/myfavourites/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/myfavourites/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/myfavourites/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/myfavourites/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/myfavourites/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/myfavourites/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/chatrelationship/create',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/chatrelationship/list',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/chatrelationship/:id',
        role: 'SYSTEM_USER',
        method: 'GET',
      },
      {
        route: '/client/api/v1/chatrelationship/count',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/chatrelationship/update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/chatrelationship/partial-update/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/chatrelationship/softdelete/:id',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/chatrelationship/softdeletemany',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
      {
        route: '/client/api/v1/chatrelationship/delete/:id',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/chatrelationship/deletemany',
        role: 'SYSTEM_USER',
        method: 'DELETE',
      },
      {
        route: '/client/api/v1/chatrelationship/addbulk',
        role: 'SYSTEM_USER',
        method: 'POST',
      },
      {
        route: '/client/api/v1/chatrelationship/updatebulk',
        role: 'SYSTEM_USER',
        method: 'PUT',
      },
    ];
    if (routeRoles && routeRoles.length) {
      const routes = [...new Set(routeRoles.map((routeRole) => routeRole.route.toLowerCase()))];
      const routeMethods = [...new Set(routeRoles.map((routeRole) => routeRole.method))];
      const roles = ['User', 'SuperAdmin', 'SYSTEM_USER'];
      const insertedProjectRoute = await dbService.findAllDocuments(ProjectRoute, {
        uri: { $in: routes },
        method: { $in: routeMethods },
        isActive: true,
        isDeleted: false,
      });
      const insertedRoles = await dbService.findAllDocuments(Role, {
        code: { $in: roles.map((role) => role.toUpperCase()) },
        isActive: true,
        isDeleted: false,
      });
      let projectRouteId = '';
      let roleId = '';
      let createRouteRoles = routeRoles.map((routeRole) => {
        projectRouteId = insertedProjectRoute.find((pr) => pr.uri === routeRole.route.toLowerCase() && pr.method === routeRole.method);
        roleId = insertedRoles.find((r) => r.code === routeRole.role.toUpperCase());
        if (projectRouteId && roleId) {
          return {
            roleId: roleId.id,
            routeId: projectRouteId.id,
          };
        }
      });
      createRouteRoles = createRouteRoles.filter(Boolean);
      const routeRolesToBeInserted = [];
      let routeRoleObj = {};

      await Promise.all(
        createRouteRoles.map(async (routeRole) => {
          routeRoleObj = await dbService.getDocumentByQuery(RouteRole, {
            routeId: routeRole.routeId,
            roleId: routeRole.roleId,
          });
          if (!routeRoleObj) {
            routeRolesToBeInserted.push({
              routeId: routeRole.routeId,
              roleId: routeRole.roleId,
            });
          }
        }),
      );
      if (routeRolesToBeInserted.length) {
        const result = await dbService.bulkInsert(RouteRole, routeRolesToBeInserted);
        if (result) console.log('RouteRole seeded 🍺');
        else console.log('RouteRole seeder failed!');
      } else {
        console.log('RouteRole is up to date 🍺');
      }
    }
  } catch (error) {
    console.log('RouteRole seeder failed due to ', error.message);
  }
}

/* seeds roles for users */
async function seedUserRole () {
  try {
    const userRoles = [{
      email: 'sagardoshi72427@gmail.com',
      password: 'U8IMufLszzHKHCa',
    }, {
      email: 'sagardoshi2020@gmail.com',
      password: '0z4pekZz1eSVGJj',
    }];
    const defaultRole = await dbService.getDocumentByQuery(Role, { code: 'SYSTEM_USER' });
    const insertedUsers = await dbService.findAllDocuments(User, { username: { $in: userRoles.map((userRole) => userRole.username) } });
    let user = {};
    const userRolesArr = [];
    userRoles.map((userRole) => {
      user = insertedUsers.find((user) => user.username === userRole.username && user.isPasswordMatch(userRole.password) && user.isActive && !user.isDeleted);
      if (user) {
        userRolesArr.push({
          userId: user.id,
          roleId: defaultRole.id,
        });
      }
    });
    let userRoleObj = {};
    const userRolesToBeInserted = [];
    if (userRolesArr.length) {
      await Promise.all(
        userRolesArr.map(async (userRole) => {
          userRoleObj = await dbService.getDocumentByQuery(UserRole, {
            userId: userRole.userId,
            roleId: userRole.roleId,
          });
          if (!userRoleObj) {
            userRolesToBeInserted.push({
              userId: userRole.userId,
              roleId: userRole.roleId,
            });
          }
        }),
      );
      if (userRolesToBeInserted.length) {
        const result = await dbService.bulkInsert(UserRole, userRolesToBeInserted);
        if (result) console.log('UserRole seeded 🍺');
        else console.log('UserRole seeder failed');
      } else {
        console.log('UserRole is up to date 🍺');
      }
    }
  } catch (error) {
    console.log('UserRole seeder failed due to ', error.message);
  }
}

async function seedData (allRegisterRoutes) {
  await seedUser();
  await seedRole();
  await seedProjectRoutes(allRegisterRoutes);
  await seedRouteRole();
  await seedUserRole();
}
module.exports = seedData;
