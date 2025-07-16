const express = require('express');
const router = express.Router();
const taskLogsController = require('../controllers/taskLogsController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['hq','command','trainer']), taskLogsController.getAllLogs);
router.post('/', authenticate, authorize(['hq','command','trainer']), taskLogsController.createLogs);
router.delete('/:id', authenticate, authorize(['hq','command']), taskLogsController.deleteLog);

module.exports = router;