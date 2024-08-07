/**
 * index.js
 * @description :: index route file of client platform.
 */

const express = require('express');

const router = express.Router();
router.use('/client/auth', require('./auth'));
router.use(require('./chatRelationshipRoutes'));
router.use(require('./partnerRoutes'));
router.use(require('./myFavouritesRoutes'));
router.use(require('./viewsRoutes'));
router.use(require('./contactRoutes'));
router.use(require('./subscribersRoutes'));
router.use(require('./userRoutes'));

module.exports = router;
