const express = require('express');
const router = express.Router();
const trainingEventsController = require('../controllers/trainingEventsController');

// GET all events
router.get('/', trainingEventsController.getAllEvents);

// GET single event
router.get('/:id', trainingEventsController.getEventById);

// POST new event
router.post('/', trainingEventsController.createEvent);

// PUT update event
router.put('/:id', trainingEventsController.updateEvent);

// DELETE event
router.delete('/:id', trainingEventsController.deleteEvent);

module.exports = router;
