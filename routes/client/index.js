/**
 * index.js
 * @description :: index route file of client platform.
 */

const express = require('express');

const router = express.Router();
router.use('/client/auth', require('./auth'));
router.use(require('./userRoutes'));
router.use(require('./uploadRoutes'));

module.exports = router;
