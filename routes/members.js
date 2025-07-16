//This file defines the routes for member-related operations.

const express = require('express');
const router = express.Router();
const membersController = require('../controllers/membersController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['hq','command']), membersController.getAllMembers);
router.get('/:id', authenticate, authorize(['hq','command']), membersController.getMemberById);
router.post('/', authenticate, authorize(['hq']), membersController.createMember);
router.put('/:id', authenticate, authorize(['hq']), membersController.updateMember);
router.delete('/:id', authenticate, authorize(['hq']), membersController.deleteMember);

module.exports = router;


