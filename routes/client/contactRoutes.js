/**
 * contactRoutes.js
 * @description :: CRUD API routes for contact
 */

const express = require('express');

const router = express.Router();
const contactController = require('../../controller/client/contactController');
const auth = require('../../middleware/auth');
const { PLATFORM } = require('../../constants/authConstant');

router.route('/client/api/v1/contact/create').post(contactController.addContact);

module.exports = router;
