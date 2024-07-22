/**
 * viewsRoutes.js
 * @description :: CRUD API routes for views
 */

const express = require('express');

const router = express.Router();
const viewsController = require('../../controller/client/viewsController');

router.route('/client/api/v1/views/create').post(viewsController.addViews);
router.route('/client/api/v1/views/list').post(viewsController.findAllViews);
router.route('/client/api/v1/views/:id').get(viewsController.getViews);
router.route('/client/api/v1/views/count').post(viewsController.getViewsCount);
router.route('/client/api/v1/views/update/:id').put(viewsController.updateViews);
router.route('/client/api/v1/views/partial-update/:id').put(viewsController.partialUpdateViews);
router.route('/client/api/v1/views/softDelete/:id').put(viewsController.softDeleteViews);
router.route('/client/api/v1/views/softDeleteMany').put(viewsController.softDeleteManyViews);
router.route('/client/api/v1/views/delete/:id').delete(viewsController.deleteViews);
router.route('/client/api/v1/views/deleteMany').post(viewsController.deleteManyViews);

module.exports = router;
