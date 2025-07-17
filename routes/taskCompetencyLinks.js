// This file defines the routes for task competency links.

const express = require('express');
const router = express.Router();
const linksController = require('../controllers/taskCompetencyLinksController');
const { authenticate, authorize } = require('../middleware/auth');
const { withAudit } = require('../middleware/auditMiddleware');

router.get('/', authenticate, authorize(['hq','command','trainer']), linksController.getAllLinks);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), linksController.getLinkById);

router.post('/', authenticate, authorize(['hq']), withAudit('task_competency_links'), linksController.createLink);
router.delete('/:id', authenticate, authorize(['hq']), withAudit('task_competency_links'), linksController.deleteLink);

module.exports = router;


