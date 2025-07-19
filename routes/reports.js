const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { authenticate, authorize } = require('../middleware/auth');

// ✅ Allow hq, command, trainer for all reports
const allowedRoles = ['hq', 'command', 'trainer'];

// ✅ Unit Readiness
router.get('/unit-readiness', authenticate, authorize(allowedRoles), reportsController.getUnitReadiness);

// ✅ Competency Summary
router.get('/competency-summary', authenticate, authorize(allowedRoles), reportsController.getCompetencySummary);

// ✅ Training History
router.get('/training-history', authenticate, authorize(allowedRoles), reportsController.getTrainingHistory);

// ✅ Upcoming Training Events
router.get('/upcoming-training', authenticate, authorize(allowedRoles), reportsController.getUpcomingTraining);

// ✅ Task Compliance (Nuanced Report)
router.get('/task-compliance', authenticate, authorize(allowedRoles), reportsController.getTaskCompliance);

// ✅ Certification Risk (Expiring Soon)
router.get('/certification-risk', authenticate, authorize(allowedRoles), reportsController.getCertificationRisk);

module.exports = router;
