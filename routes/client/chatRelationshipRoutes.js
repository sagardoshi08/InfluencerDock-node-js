/**
 * chatRelationshipRoutes.js
 * @description :: CRUD API routes for chatRelationship
 */

const express = require('express');

const router = express.Router();
const chatRelationshipController = require('../../controller/client/chatRelationshipController');
const auth = require('../../middleware/auth');
const { PLATFORM } = require('../../constants/authConstant');
const checkRolePermission = require('../../middleware/checkRolePermission');

router.route('/client/api/v1/chatrelationship/create').post(auth(PLATFORM.CLIENT), checkRolePermission, chatRelationshipController.addChatRelationship);
router.route('/client/api/v1/chatrelationship/list').post(auth(PLATFORM.CLIENT), checkRolePermission, chatRelationshipController.findAllChatRelationship);
router.route('/client/api/v1/chatrelationship/:id').get(auth(PLATFORM.CLIENT), checkRolePermission, chatRelationshipController.getChatRelationship);
router.route('/client/api/v1/chatrelationship/count').post(auth(PLATFORM.CLIENT), checkRolePermission, chatRelationshipController.getChatRelationshipCount);

module.exports = router;
