//This file defines the routes for task management in the application.

const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['hq','command','trainer']), tasksController.getAllTasks);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), tasksController.getTaskById);
router.post('/', authenticate, authorize(['hq']), tasksController.createTask);
router.put('/:id', authenticate, authorize(['hq']), tasksController.updateTask);
router.delete('/:id', authenticate, authorize(['hq']), tasksController.deleteTask);

module.exports = router;

