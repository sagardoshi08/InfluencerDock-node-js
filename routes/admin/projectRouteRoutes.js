/**
 * projectRouteRoutes.js
 * @description :: CRUD API routes for projectRoute
 */

const express = require('express');

const router = express.Router();
const projectRouteController = require('../../controller/admin/projectRouteController');
const auth = require('../../middleware/auth');
const { PLATFORM } = require('../../constants/authConstant');

router.route('/admin/projectroute/create').post(auth(PLATFORM.ADMIN), projectRouteController.addProjectRoute);
router.route('/admin/projectroute/addBulk').post(auth(PLATFORM.ADMIN), projectRouteController.bulkInsertProjectRoute);
router.route('/admin/projectroute/list').post(auth(PLATFORM.ADMIN), projectRouteController.findAllProjectRoute);
router.route('/admin/projectroute/:id').get(auth(PLATFORM.ADMIN), projectRouteController.getProjectRoute);
router.route('/admin/projectroute/partial-update/:id').put(auth(PLATFORM.ADMIN), projectRouteController.partialUpdateProjectRoute);
router.route('/admin/projectroute/softDelete/:id').put(auth(PLATFORM.ADMIN), projectRouteController.softDeleteProjectRoute);
router.route('/admin/projectroute/update/:id').put(auth(PLATFORM.ADMIN), projectRouteController.updateProjectRoute);
router.route('/admin/projectroute/count').post(auth(PLATFORM.ADMIN), projectRouteController.getProjectRouteCount);
router.route('/admin/projectroute/updateBulk').put(auth(PLATFORM.ADMIN), projectRouteController.bulkUpdateProjectRoute);

module.exports = router;
