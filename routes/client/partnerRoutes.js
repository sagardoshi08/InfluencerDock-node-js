/**
 * partnerRoutes.js
 * @description :: CRUD API routes for partner
 */

const express = require('express');

const router = express.Router();
const partnerController = require('../../controller/client/partnerController');

router.route('/client/api/v1/partner/list').post(partnerController.findAllPartner);
router.route('/client/api/v1/partner/:id').get(partnerController.getPartner);
router.route('/client/api/v1/partner/count').post(partnerController.getPartnerCount);

module.exports = router;
