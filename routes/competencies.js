// This file defines the routes for competencies in the application.

const express = require('express');
const router = express.Router();
const competenciesController = require('../controllers/competenciesController');

router.get('/', competenciesController.getAllCompetencies);
router.get('/:id', competenciesController.getCompetencyById);
router.post('/', competenciesController.createCompetency);
router.put('/:id', competenciesController.updateCompetency);
router.delete('/:id', competenciesController.deleteCompetency);

module.exports = router;
