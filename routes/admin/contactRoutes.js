/**
 * contactRoutes.js
 * @description :: CRUD API routes for contact
 */

const express = require('express');

const router = express.Router();
const contactController = require('../../controller/admin/contactController');
const auth = require('../../middleware/auth');
const { PLATFORM } = require('../../constants/authConstant');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/contact/create').post(auth(PLATFORM.ADMIN), checkRolePermission, contactController.addContact);
router.route('/admin/contact/list').post(auth(PLATFORM.ADMIN), checkRolePermission, contactController.findAllContact);
router.route('/admin/contact/:id').get(auth(PLATFORM.ADMIN), checkRolePermission, contactController.getContact);
router.route('/admin/contact/count').post(auth(PLATFORM.ADMIN), checkRolePermission, contactController.getContactCount);
router.route('/admin/contact/update/:id').put(auth(PLATFORM.ADMIN), checkRolePermission, contactController.updateContact);
router.route('/admin/contact/partial-update/:id').put(auth(PLATFORM.ADMIN), checkRolePermission, contactController.partialUpdateContact);
router.route('/admin/contact/softDelete/:id').put(auth(PLATFORM.ADMIN), checkRolePermission, contactController.softDeleteContact);
router.route('/admin/contact/softDeleteMany').put(auth(PLATFORM.ADMIN), checkRolePermission, contactController.softDeleteManyContact);
router.route('/admin/contact/updateBulk').put(auth(PLATFORM.ADMIN), checkRolePermission, contactController.bulkUpdateContact);
router.route('/admin/contact/delete/:id').delete(auth(PLATFORM.ADMIN), checkRolePermission, contactController.deleteContact);
router.route('/admin/contact/deleteMany').post(auth(PLATFORM.ADMIN), checkRolePermission, contactController.deleteManyContact);

module.exports = router;
