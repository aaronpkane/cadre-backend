const express = require('express');
const router = express.Router();
const controller = require('../controllers/trainingEventAttendeesController');
const { authenticate, authorize } = require('../middleware/auth');
const { withAudit } = require('../middleware/auditMiddleware');

router.get('/', authenticate, authorize(['hq','command']), controller.getAllAttendees);
router.get('/:id', authenticate, authorize(['hq','command']), controller.getAttendeeById);

router.post('/', authenticate, authorize(['hq','command']), withAudit('training_event_attendees'), controller.addAttendee);
router.put('/:id', authenticate, authorize(['hq','command']), withAudit('training_event_attendees'), controller.updateAttendee);
router.delete('/:id', authenticate, authorize(['hq','command']), withAudit('training_event_attendees'), controller.deleteAttendee);

module.exports = router;


