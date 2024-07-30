/**
 * userRoutes.js
 * @description :: CRUD API routes for user
 */

const express = require('express');

const router = express.Router();
const userController = require('../../controller/client/userController');
const auth = require('../../middleware/auth');
const { PLATFORM } = require('../../constants/authConstant');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/client/api/v1/user/create').post(auth(PLATFORM.CLIENT), checkRolePermission, userController.addUser);
router.route('/client/api/v1/user/update/:id').put(auth(PLATFORM.CLIENT), checkRolePermission, userController.updateUser);
router.route('/client/api/v1/user/partial-update/:id').put(auth(PLATFORM.CLIENT), checkRolePermission, userController.partialUpdateUser);
router.route('/client/api/v1/user/list').post(userController.findAllUser);
router.route('/client/api/v1/user/me').get(auth(PLATFORM.CLIENT), userController.getLoggedInUserInfo);
router.route('/client/api/v1/user/popular-user-location').get(userController.getPopularUserLocation);
router.route('/client/api/v1/user/:username').get(userController.getUser);
// router.route('/client/api/v1/user/:id').get(auth(PLATFORM.CLIENT), checkRolePermission, userController.getUser);
router.route('/client/api/v1/user/count').post(auth(PLATFORM.CLIENT), checkRolePermission, userController.getUserCount);
router.route('/client/api/v1/user/change-password').put(auth(PLATFORM.CLIENT), userController.changePassword);
router.route('/client/api/v1/user/update-profile').put(auth(PLATFORM.CLIENT), userController.updateProfile);

module.exports = router;
