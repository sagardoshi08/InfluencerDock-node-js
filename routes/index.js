/**
 * index.js
 * @description :: index route of platforms
 */

const express = require('express');

const router = express.Router();
const rateLimit = require('express-rate-limit');

const allowlist = ['::1'];

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many API calls from this IP, please try again after a 15 minutes',
  skip: (req) => allowlist.includes(req.ip),
});

router.use(rateLimiter, require('./admin/index'));
router.use(rateLimiter, require('./client/index'));

module.exports = router;
