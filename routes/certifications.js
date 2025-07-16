const express = require('express');
const router = express.Router();
const certificationsController = require('../controllers/certificationsController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['hq','command','trainer']), certificationsController.getAllCertifications);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), certificationsController.getCertificationById);
router.post('/', authenticate, authorize(['hq','command']), certificationsController.createCertification);
router.delete('/:id', authenticate, authorize(['hq']), certificationsController.deleteCertification);

module.exports = router;

