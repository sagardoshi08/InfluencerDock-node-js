/**
 * partnerRoutes.js
 * @description :: CRUD API routes for partner
 */

const express = require('express');

const router = express.Router();
const partnerController = require('../../controller/admin/partnerController');
const auth = require('../../middleware/auth');
const { PLATFORM } = require('../../constants/authConstant');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/partner/create').post(auth(PLATFORM.ADMIN), checkRolePermission, partnerController.addPartner);
router.route('/admin/partner/list').post(auth(PLATFORM.ADMIN), checkRolePermission, partnerController.findAllPartner);
router.route('/admin/partner/:id').get(auth(PLATFORM.ADMIN), checkRolePermission, partnerController.getPartner);
router.route('/admin/partner/count').post(auth(PLATFORM.ADMIN), checkRolePermission, partnerController.getPartnerCount);
router.route('/admin/partner/update/:id').put(auth(PLATFORM.ADMIN), checkRolePermission, partnerController.updatePartner);
router.route('/admin/partner/partial-update/:id').put(auth(PLATFORM.ADMIN), checkRolePermission, partnerController.partialUpdatePartner);
router.route('/admin/partner/softDelete/:id').put(auth(PLATFORM.ADMIN), checkRolePermission, partnerController.softDeletePartner);
router.route('/admin/partner/softDeleteMany').put(auth(PLATFORM.ADMIN), checkRolePermission, partnerController.softDeleteManyPartner);
router.route('/admin/partner/delete/:id').delete(auth(PLATFORM.ADMIN), checkRolePermission, partnerController.deletePartner);
router.route('/admin/partner/deleteMany').post(auth(PLATFORM.ADMIN), checkRolePermission, partnerController.deleteManyPartner);

module.exports = router;
