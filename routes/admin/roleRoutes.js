/**
 * roleRoutes.js
 * @description :: CRUD API routes for role
 */

const express = require('express');

const router = express.Router();
const roleController = require('../../controller/admin/roleController');
const auth = require('../../middleware/auth');
const { PLATFORM } = require('../../constants/authConstant');

router.route('/admin/role/create').post(auth(PLATFORM.ADMIN), roleController.addRole);
router.route('/admin/role/addBulk').post(auth(PLATFORM.ADMIN), roleController.bulkInsertRole);
router.route('/admin/role/list').post(auth(PLATFORM.ADMIN), roleController.findAllRole);
router.route('/admin/role/:id').get(auth(PLATFORM.ADMIN), roleController.getRole);
router.route('/admin/role/partial-update/:id').put(auth(PLATFORM.ADMIN), roleController.partialUpdateRole);
router.route('/admin/role/softDelete/:id').put(auth(PLATFORM.ADMIN), roleController.softDeleteRole);
router.route('/admin/role/update/:id').put(auth(PLATFORM.ADMIN), roleController.updateRole);
router.route('/admin/role/count').post(auth(PLATFORM.ADMIN), roleController.getRoleCount);
router.route('/admin/role/updateBulk').put(auth(PLATFORM.ADMIN), roleController.bulkUpdateRole);

module.exports = router;
