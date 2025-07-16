const express = require('express');
const router = express.Router();
const trainingEventsController = require('../controllers/trainingEventsController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['hq','command','trainer']), trainingEventsController.getAllEvents);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), trainingEventsController.getEventById);
router.post('/', authenticate, authorize(['hq','command']), trainingEventsController.createEvent);
router.put('/:id', authenticate, authorize(['hq','command']), trainingEventsController.updateEvent);
router.delete('/:id', authenticate, authorize(['hq']), trainingEventsController.deleteEvent);

module.exports = router;

