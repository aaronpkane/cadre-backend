const express = require('express');
const router = express.Router();
const taskLogsController = require('../controllers/taskLogsController');
const { authenticate, authorize } = require('../middleware/auth');
const { withAudit } = require('../middleware/auditMiddleware');

router.get('/', authenticate, authorize(['hq','command','trainer']), taskLogsController.getAllLogs);

router.post('/', authenticate, authorize(['hq','command','trainer']), withAudit('task_logs'), taskLogsController.createLogs);
router.delete('/:id', authenticate, authorize(['hq','command']), withAudit('task_logs'), taskLogsController.deleteLog);

module.exports = router;
