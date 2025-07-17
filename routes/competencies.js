// This file defines the routes for competencies in the application.

const express = require('express');
const router = express.Router();
const competenciesController = require('../controllers/competenciesController');
const { authenticate, authorize } = require('../middleware/auth');
const { withAudit } = require('../middleware/auditMiddleware');

router.get('/', authenticate, authorize(['hq','command','trainer']), competenciesController.getAllCompetencies);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), competenciesController.getCompetencyById);

router.post('/', authenticate, authorize(['hq']), withAudit('competencies'), competenciesController.createCompetency);
router.put('/:id', authenticate, authorize(['hq']), withAudit('competencies'), competenciesController.updateCompetency);
router.delete('/:id', authenticate, authorize(['hq']), withAudit('competencies'), competenciesController.deleteCompetency);

module.exports = router;


