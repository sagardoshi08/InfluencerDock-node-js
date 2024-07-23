/**
 * myFavouritesRoutes.js
 * @description :: CRUD API routes for myFavourites
 */

const express = require('express');

const router = express.Router();
const myFavouritesController = require('../../controller/client/myFavouritesController');
const auth = require('../../middleware/auth');
const { PLATFORM } = require('../../constants/authConstant');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/client/api/v1/myfavourites/create').post(auth(PLATFORM.CLIENT), checkRolePermission, myFavouritesController.addMyFavourites);
router.route('/client/api/v1/myfavourites/list').post(auth(PLATFORM.CLIENT), checkRolePermission, myFavouritesController.findAllMyFavourites);
router.route('/client/api/v1/myfavourites/:id').get(auth(PLATFORM.CLIENT), checkRolePermission, myFavouritesController.getMyFavourites);
router.route('/client/api/v1/myfavourites/count').post(auth(PLATFORM.CLIENT), checkRolePermission, myFavouritesController.getMyFavouritesCount);
router.route('/client/api/v1/myfavourites/delete/:id').delete(auth(PLATFORM.CLIENT), checkRolePermission, myFavouritesController.deleteMyFavourites);
router.route('/client/api/v1/myfavourites/deleteMany').post(auth(PLATFORM.CLIENT), checkRolePermission, myFavouritesController.deleteManyMyFavourites);
router.route('/client/api/v1/myfavourites/softDelete/:id').put(auth(PLATFORM.CLIENT), checkRolePermission, myFavouritesController.softDeleteMyFavourites);
router.route('/client/api/v1/myfavourites/softDeleteMany').put(auth(PLATFORM.CLIENT), checkRolePermission, myFavouritesController.softDeleteManyMyFavourites);

module.exports = router;
