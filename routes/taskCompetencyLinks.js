const express = require('express');
const router = express.Router();
const linksController = require('../controllers/taskCompetencyLinksController');

// READ all links, with optional query filters:
//   GET /api/task-competency-links
//   GET /api/task-competency-links?competency=2
//   GET /api/task-competency-links?task=5
router.get('/', linksController.getAllLinks);

// READ one link by its own ID
//   GET /api/task-competency-links/:id
router.get('/:id', linksController.getLinkById);

// CREATE a new link
//   POST /api/task-competency-links
//   { task_id: 3, competency_id: 1, certification_phase: "initial", recurrence_type: "annual" }
router.post('/', linksController.createLink);

// DELETE a link
//   DELETE /api/task-competency-links/:id
router.delete('/:id', linksController.deleteLink);

module.exports = router;
