/**
 * subscribersRoutes.js
 * @description :: CRUD API routes for subscribers
 */

const express = require('express');

const router = express.Router();
const subscribersController = require('../../controller/client/subscribersController');

router.route('/client/api/v1/subscribers/create').post(subscribersController.addSubscribers);

module.exports = router;
