const express = require('express');
const router = express.Router();
const trainingEventsController = require('../controllers/trainingEventsController');
const { authenticate, authorize } = require('../middleware/auth');
const { withAudit } = require('../middleware/auditMiddleware');

router.get('/', authenticate, authorize(['hq','command','trainer']), trainingEventsController.getAllEvents);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), trainingEventsController.getEventById);

router.post('/', authenticate, authorize(['hq','command']), withAudit('training_events'), trainingEventsController.createEvent);
router.put('/:id', authenticate, authorize(['hq','command']), withAudit('training_events'), trainingEventsController.updateEvent);
router.delete('/:id', authenticate, authorize(['hq']), withAudit('training_events'), trainingEventsController.deleteEvent);

module.exports = router;


