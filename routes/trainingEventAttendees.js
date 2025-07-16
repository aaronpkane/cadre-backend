const express = require('express');
const router = express.Router();
const controller = require('../controllers/trainingEventAttendeesController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['hq','command']), controller.getAllAttendees);
router.get('/:id', authenticate, authorize(['hq','command']), controller.getAttendeeById);
router.post('/', authenticate, authorize(['hq','command']), controller.addAttendee);
router.put('/:id', authenticate, authorize(['hq','command']), controller.updateAttendee);
router.delete('/:id', authenticate, authorize(['hq','command']), controller.deleteAttendee);

module.exports = router;

