/**
 * userRoleRoutes.js
 * @description :: CRUD API routes for userRole
 */

const express = require('express');

const router = express.Router();
const userRoleController = require('../../controller/admin/userRoleController');
const auth = require('../../middleware/auth');
const { PLATFORM } = require('../../constants/authConstant');

router.route('/admin/userrole/create').post(auth(PLATFORM.ADMIN), userRoleController.addUserRole);
router.route('/admin/userrole/addBulk').post(auth(PLATFORM.ADMIN), userRoleController.bulkInsertUserRole);
router.route('/admin/userrole/list').post(auth(PLATFORM.ADMIN), userRoleController.findAllUserRole);
router.route('/admin/userrole/:id').get(auth(PLATFORM.ADMIN), userRoleController.getUserRole);
router.route('/admin/userrole/partial-update/:id').put(auth(PLATFORM.ADMIN), userRoleController.partialUpdateUserRole);
router.route('/admin/userrole/update/:id').put(auth(PLATFORM.ADMIN), userRoleController.updateUserRole);
router.route('/admin/userrole/softDelete/:id').put(auth(PLATFORM.ADMIN), userRoleController.softDeleteUserRole);
router.route('/admin/userrole/count').post(auth(PLATFORM.ADMIN), userRoleController.getUserRoleCount);
router.route('/admin/userrole/updateBulk').put(auth(PLATFORM.ADMIN), userRoleController.bulkUpdateUserRole);

module.exports = router;
