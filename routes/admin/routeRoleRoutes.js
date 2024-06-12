/**
 * routeRoleRoutes.js
 * @description :: CRUD API routes for routeRole
 */

const express = require('express');

const router = express.Router();
const routeRoleController = require('../../controller/admin/routeRoleController');
const auth = require('../../middleware/auth');
const { PLATFORM } = require('../../constants/authConstant');

router.route('/admin/routerole/create').post(auth(PLATFORM.ADMIN), routeRoleController.addRouteRole);
router.route('/admin/routerole/addBulk').post(auth(PLATFORM.ADMIN), routeRoleController.bulkInsertRouteRole);
router.route('/admin/routerole/list').post(auth(PLATFORM.ADMIN), routeRoleController.findAllRouteRole);
router.route('/admin/routerole/:id').get(auth(PLATFORM.ADMIN), routeRoleController.getRouteRole);
router.route('/admin/routerole/partial-update/:id').put(auth(PLATFORM.ADMIN), routeRoleController.partialUpdateRouteRole);
router.route('/admin/routerole/update/:id').put(auth(PLATFORM.ADMIN), routeRoleController.updateRouteRole);
router.route('/admin/routerole/softDelete/:id').put(auth(PLATFORM.ADMIN), routeRoleController.softDeleteRouteRole);
router.route('/admin/routerole/count').post(auth(PLATFORM.ADMIN), routeRoleController.getRouteRoleCount);
router.route('/admin/routerole/updateBulk').put(auth(PLATFORM.ADMIN), routeRoleController.bulkUpdateRouteRole);

module.exports = router;
