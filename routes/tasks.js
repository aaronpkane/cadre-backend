//This file defines the routes for task management in the application.

const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
const { authenticate, authorize } = require('../middleware/auth');
const { withAudit } = require('../middleware/auditMiddleware');

router.get('/', authenticate, authorize(['hq','command','trainer']), tasksController.getAllTasks);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), tasksController.getTaskById);
router.post('/', authenticate, authorize(['hq']), withAudit('tasks'), tasksController.createTask);
router.put('/:id', authenticate, authorize(['hq']), withAudit('tasks'), tasksController.updateTask);
router.delete('/:id', authenticate, authorize(['hq']), withAudit('tasks'), tasksController.deleteTask);

module.exports = router;


