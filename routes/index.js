/**
 * index.js
 * @description :: index route of platforms
 */

const express = require('express');

const router = express.Router();
const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 50,
  message: 'Too many API calls from this IP, please try again after a 30 minutes',
});

router.use(rateLimiter, require('./admin/index'));
router.use(rateLimiter, require('./client/index'));

module.exports = router;
