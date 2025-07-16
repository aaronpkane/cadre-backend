// This file defines the routes for task competency links.

const express = require('express');
const router = express.Router();
const linksController = require('../controllers/taskCompetencyLinksController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['hq','command','trainer']), linksController.getAllLinks);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), linksController.getLinkById);
router.post('/', authenticate, authorize(['hq']), linksController.createLink);
router.delete('/:id', authenticate, authorize(['hq']), linksController.deleteLink);

module.exports = router;

