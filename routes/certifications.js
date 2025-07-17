const express = require('express');
const router = express.Router();
const certificationsController = require('../controllers/certificationsController');
const { authenticate, authorize } = require('../middleware/auth');
const { withAudit } = require('../middleware/auditMiddleware');

router.get('/', authenticate, authorize(['hq','command','trainer']), certificationsController.getAllCertifications);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), certificationsController.getCertificationById);

router.post('/', authenticate, authorize(['hq','command']), withAudit('certifications'), certificationsController.createCertification);
router.delete('/:id', authenticate, authorize(['hq']), withAudit('certifications'), certificationsController.deleteCertification);

module.exports = router;


