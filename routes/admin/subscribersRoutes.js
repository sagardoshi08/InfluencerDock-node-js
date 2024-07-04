/**
 * subscribersRoutes.js
 * @description :: CRUD API routes for subscribers
 */

const express = require('express');

const router = express.Router();
const subscribersController = require('../../controller/admin/subscribersController');
const auth = require('../../middleware/auth');
const { PLATFORM } = require('../../constants/authConstant');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/admin/subscribers/list').post(auth(PLATFORM.ADMIN), checkRolePermission, subscribersController.findAllSubscribers);
router.route('/admin/subscribers/:id').get(auth(PLATFORM.ADMIN), checkRolePermission, subscribersController.getSubscribers);
router.route('/admin/subscribers/count').post(auth(PLATFORM.ADMIN), checkRolePermission, subscribersController.getSubscribersCount);
router.route('/admin/subscribers/softDelete/:id').put(auth(PLATFORM.ADMIN), checkRolePermission, subscribersController.softDeleteSubscribers);
router.route('/admin/subscribers/softDeleteMany').put(auth(PLATFORM.ADMIN), checkRolePermission, subscribersController.softDeleteManySubscribers);
router.route('/admin/subscribers/delete/:id').delete(auth(PLATFORM.ADMIN), checkRolePermission, subscribersController.deleteSubscribers);
router.route('/admin/subscribers/deleteMany').post(auth(PLATFORM.ADMIN), checkRolePermission, subscribersController.deleteManySubscribers);

module.exports = router;
