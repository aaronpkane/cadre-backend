# **ROUTES**

## auth.js
```javascript
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userResult = await pool.query(`
            SELECT u.id, u.username, u.password_hash, r.name AS role
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.username = $1
        `, [username]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = userResult.rows[0];

        console.log('User from DB:', user);

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
```


## certifications.js
```javascript
const express = require('express');
const router = express.Router();
const certificationsController = require('../controllers/certificationsController');
const { authenticate, authorize } = require('../middleware/auth');
const { withAudit } = require('../middleware/auditMiddleware');

router.get('/', authenticate, authorize(['hq','command','trainer']), certificationsController.getAllCertifications);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), certificationsController.getCertificationById);
router.post('/', authenticate, authorize(['hq','command']), withAudit('certifications'), certificationsController.createCertification);
router.delete('/:id', authenticate, authorize(['hq']), withAudit('certifications'), certificationsController.deleteCertification);
router.patch('/:id', authenticate, authorize(['hq','command']), withAudit('certifications'), certificationsController.updateCertificationStatus);

module.exports = router;
```


## competencies.js
```javascript
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
```


## members.js
```javascript
const express = require('express');
const router = express.Router();
const membersController = require('../controllers/membersController');
const { authenticate, authorize } = require('../middleware/auth');
const { withAudit } = require('../middleware/auditMiddleware');

router.get('/', authenticate, authorize(['hq','command']), membersController.getAllMembers);
router.get('/:id', authenticate, authorize(['hq','command']), membersController.getMemberById);

router.post('/', authenticate, authorize(['hq']), withAudit('members'), membersController.createMember);
router.put('/:id', authenticate, authorize(['hq']), withAudit('members'), membersController.updateMember);
router.delete('/:id', authenticate, authorize(['hq']), withAudit('members'), membersController.deleteMember);

module.exports = router;
```


## reports.js
```javascript
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
```


## tasckCompetencyLinks.js
```javascript
const express = require('express');
const router = express.Router();
const linksController = require('../controllers/taskCompetencyLinksController');
const { authenticate, authorize } = require('../middleware/auth');
const { withAudit } = require('../middleware/auditMiddleware');

router.get('/', authenticate, authorize(['hq','command','trainer']), linksController.getAllLinks);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), linksController.getLinkById);

router.post('/', authenticate, authorize(['hq']), withAudit('task_competency_links'), linksController.createLink);
router.delete('/:id', authenticate, authorize(['hq']), withAudit('task_competency_links'), linksController.deleteLink);

module.exports = router;
```


## taskLogs.js
```javascript
const express = require('express');
const router = express.Router();
const taskLogsController = require('../controllers/taskLogsController');
const { authenticate, authorize } = require('../middleware/auth');
const { withAudit } = require('../middleware/auditMiddleware');

router.get('/', authenticate, authorize(['hq','command','trainer']), taskLogsController.getAllLogs);

router.post('/', authenticate, authorize(['hq','command','trainer']), withAudit('task_logs'), taskLogsController.createLogs);
router.delete('/:id', authenticate, authorize(['hq','command']), withAudit('task_logs'), taskLogsController.deleteLog);

module.exports = router;
```


## tasks.js
```javascript
const express = require('express');
const router = express.Router();
const taskLogsController = require('../controllers/taskLogsController');
const { authenticate, authorize } = require('../middleware/auth');
const { withAudit } = require('../middleware/auditMiddleware');

router.get('/', authenticate, authorize(['hq','command','trainer']), taskLogsController.getAllLogs);

router.post('/', authenticate, authorize(['hq','command','trainer']), withAudit('task_logs'), taskLogsController.createLogs);
router.delete('/:id', authenticate, authorize(['hq','command']), withAudit('task_logs'), taskLogsController.deleteLog);

module.exports = router;
```


## trainingEventAttendees.js
```javascript
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
```


## trainingEvents.js
```javascript
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
```


# **CONTROLLERS**

## certificationsController.js
```javascript
const db = require('../db');
const { successResponse, errorResponse } = require('../utils/response');

// GET all certifications
exports.getAllCertifications = async (req, res) => {
  try {
    const { member_id, competency_id } = req.query;
    let sql = `
      SELECT c.*, m.first_name AS member_first, m.last_name AS member_last,
             comp.title AS competency_title
        FROM certifications c
        JOIN members m ON c.member_id = m.id
        JOIN competencies comp ON c.competency_id = comp.id
    `;
    const params = [];
    const conditions = [];

    if (member_id) {
      params.push(member_id);
      conditions.push(`c.member_id = $${params.length}`);
    }
    if (competency_id) {
      params.push(competency_id);
      conditions.push(`c.competency_id = $${params.length}`);
    }

    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY certification_date DESC';

    const result = await db.query(sql, params);
    return successResponse(res, result.rows, 200);
  } catch (err) {
    console.error('Error fetching certifications:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// GET Certification by ID
exports.getCertificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM certifications WHERE id = $1', [id]);
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Certification not found' }, 404);
    }
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error fetching certification:', err);
    return errorResponse(res,'Internal server error', 500);
  }
};

// POST: Create certification (with validation)
exports.createCertification = async (req, res) => {
  const { member_id, competency_id, certified_by, certification_phase } = req.body;

  if (!member_id || !competency_id || !certification_phase) {
    return errorResponse(res, { message: 'Missing required fields: member_id, competency_id, certification_phase' }, 400);
  }

  try {
    // 1. Fetch required initial-phase tasks for this competency
    const requiredTasks = await db.query(
      `SELECT task_id FROM task_competency_links
        WHERE competency_id = $1 AND certification_phase = 'initial'`,
      [competency_id]
    );

    if (!requiredTasks.rows.length) {
      return errorResponse(res, { message: 'No initial-phase tasks found for this competency' }, 400);
    }

    const taskIds = requiredTasks.rows.map(row => row.task_id);

    // 2. Check if member has completed all required tasks
    const completedTasks = await db.query(
      `SELECT DISTINCT task_id FROM task_logs
        WHERE member_id = $1 AND task_id = ANY($2::int[])`,
      [member_id, taskIds]
    );

    if (completedTasks.rows.length < taskIds.length) {
      return errorResponse(res, { message: 'Member has not completed all required tasks for this competency' }, 400);
    }

    // 3. Insert certification
    const result = await db.query(
      `INSERT INTO certifications (member_id, competency_id, certified_by, date_certified)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [member_id, competency_id, certified_by, date_certified || new Date()]
    );

    return successResponse(res, result.rows[0], 201);
  } catch (err) {
    console.error('Error creating certification:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// PATCH: Update certification status
exports.updateCertificationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = ['current', 'expired', 'revoked'];
  if (!status || !allowedStatuses.includes(status)) {
    return errorResponse(res, { message: `Invalid or missing status. Allowed: ${allowedStatuses.join(', ')}` }, 400);
  }

  try {
    const result = await db.query(
      `UPDATE certifications
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (!result.rows.length) return errorResponse(res, { message: 'Certification not found' }, 404);
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error updating certification status', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// DELETE certification
exports.deleteCertification = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM certifications WHERE id = $1 RETURNING *', [id]);
    if (!result.rows.length) return errorResponse(res, { message: 'Certification not found' }, 404);
    return successResponse(res, { message: 'Certification removed successfully' }, 200);
  } catch (err) {
    console.error('Error deleting certification:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};
```


## competenciesController.js
```javascript
const db = require('../db');
const { successResponse, errorResponse } = require('../utils/response');

// GET /api/competencies
exports.getAllCompetencies = async (req, res) => {
  console.log('GET /api/competencies');
  try {
    const result = await db.query(
      'SELECT * FROM competencies ORDER BY code ASC'
    );
    return successResponse(res, result.rows, 200);
  } catch (err) {
    console.error('Error fetching competencies:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// GET /api/competencies/:id
exports.getCompetencyById = async (req, res) => {
  const { id } = req.params;
  console.log(`GET /api/competencies/${id}`);
  try {
    const result = await db.query(
      'SELECT * FROM competencies WHERE id = $1',
      [id]
    );
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Competency not found' }, 404);
    }
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error fetching competency:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// POST /api/competencies
exports.createCompetency = async (req, res) => {
  console.log('POST /api/competencies', req.body);
  const { code, title, description } = req.body;
  
  if (!code || !title) {
    return errorResponse(res, { message: 'Missing required fields: code, title' }, 400);
  }

  try {
    const result = await db.query(
      `INSERT INTO competencies (code, title, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [code, title, description]
    );
    return successResponse(res, result.rows[0], 201);
  } catch (err) {
    console.error('Error creating competency:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// PUT /api/competencies/:id
exports.updateCompetency = async (req, res) => {
  const { id } = req.params;
  console.log(`PUT /api/competencies/${id}`, req.body);
  const { code, title, description } = req.body;

  if (!code || !title) {
    return errorResponse(res, { message: 'Missing required fields: code, title' }, 400);
  }
  
  try {
    const result = await db.query(
      `UPDATE competencies
       SET code = $1, title = $2, description = $3
       WHERE id = $4
       RETURNING *`,
      [code, title, description, id]
    );
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Competency not found' }, 404);
    }
    return successResponse(res, result.rows[0]);
  } catch (err) {
    console.error('Error updating competency:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// DELETE /api/competencies/:id
exports.deleteCompetency = async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /api/competencies/${id}`);
  try {
    const result = await db.query(
      'DELETE FROM competencies WHERE id = $1 RETURNING *',
      [id]
    );
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Competency not found' }, 404);
    }
    return successResponse(res, { message: 'Competency deleted' }, 200);
  } catch (err) {
    console.error('Error deleting competency:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};
```


## membersController.js
```javascript
const db = require('../db');
const { successResponse, errorResponse } = require('../utils/response');

// GET all members
exports.getAllMembers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM members ORDER BY last_name ASC');
    return successResponse(res, result.rows, 200);
  } catch (err) {
    console.error('Error fetching members:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// GET member by ID
exports.getMemberById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM members WHERE id = $1', [id]);
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Member not found' }, 404);
    }
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error fetching member:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// POST new member
exports.createMember = async (req, res) => {
  const { first_name, last_name, employee_id, unit_id, email, rate_rank } = req.body;

  if (!first_name || !last_name || !employee_id || !unit_id) {
  return errorResponse(res, { message: 'Missing required fields: first_name, last_name, employee_id, unit_id' }, 400);
}

  try {
    const result = await db.query(
      'INSERT INTO members (first_name, last_name, employee_id, unit_id, email, rate_rank) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [first_name, last_name, employee_id, unit_id, email, rate_rank]
    );
    return successResponse(res, result.rows[0], 201);
  } catch (err) {
    console.error('Error creating member:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// PUT update member
exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, employee_id, unit_id, email, rate_rank } = req.body;

  if (!first_name || !last_name || !employee_id || !unit_id) {
  return errorResponse(res, { message: 'Missing required fields: first_name, last_name, employee_id, unit_id' }, 400);
}

  try {
    const result = await db.query(
      'UPDATE members SET first_name = $1, last_name = $2, employee_id = $3, unit_id = $4, email = $5, rate_rank = $6 WHERE id = $7 RETURNING *',
      [first_name, last_name, employee_id, unit_id, email, rate_rank, id]
    );
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Member not found' }, 404);
    } 
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error updating member:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// DELETE member
exports.deleteMember = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM members WHERE id = $1 RETURNING *', [id]);
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Member not found' }, 404);
    }
    return successResponse(res, { message: 'Member deleted' }, 200);
  } catch (err) {
    console.error('Error deleting member:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};
```


## reportsController.js
```javascript
const db = require('../db');
const { successResponse, errorResponse } = require('../utils/response');

// 1. Unit Readiness
exports.getUnitReadiness = async (req, res) => {
  try {
    const { competency_id, unit_id } = req.query;

    const sql = `
      SELECT u.id AS unit_id, u.name AS unit_name,
             COUNT(m.id) AS total_members,
             COUNT(c.id) FILTER (WHERE c.status = 'active') AS certified_members,
             ROUND(COUNT(c.id) FILTER (WHERE c.status = 'active') * 100.0 / NULLIF(COUNT(m.id), 0), 2) AS readiness_percentage
      FROM units u
      JOIN members m ON m.unit_id = u.id
      LEFT JOIN certifications c ON c.member_id = m.id
          AND ($1::int IS NULL OR c.competency_id = $1::int)
      WHERE ($2::int IS NULL OR u.id = $2::int)
      GROUP BY u.id, u.name
      ORDER BY readiness_percentage DESC;
    `;

    const params = [
      competency_id ? parseInt(competency_id) : null,
      unit_id ? parseInt(unit_id) : null
    ];

    const result = await db.query(sql, params);

    return successResponse(res, { count: result.rowCount, units: result.rows });
  } catch (err) {
    console.error('Error fetching unit readiness report:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// ✅ 2. Competency Summary
exports.getCompetencySummary = async (req, res) => {
  try {
    const { competency_id } = req.query;

    if (!competency_id) {
      return errorResponse(res, 'competency_id is required', 400);
    }

    const sql = `
      SELECT c.status, COUNT(*) AS count
      FROM certifications c
      WHERE c.competency_id = $1::int
      GROUP BY c.status;
    `;

    const result = await db.query(sql, [parseInt(competency_id)]);
    return successResponse(res, { competency_id: parseInt(competency_id), summary: result.rows });
  } catch (err) {
    console.error('Error fetching competency summary:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// ✅ 3. Training History
exports.getTrainingHistory = async (req, res) => {
  try {
    const { member_id, unit_id, start_date, end_date } = req.query;

    const sql = `
      SELECT tl.id, tl.task_id, t.title AS task_title,
             tl.member_id, m.first_name || ' ' || m.last_name AS member_name,
             tl.completion_date
      FROM task_logs tl
      JOIN tasks t ON t.id = tl.task_id
      JOIN members m ON m.id = tl.member_id
      WHERE ($1::int IS NULL OR tl.member_id = $1::int)
        AND ($2::int IS NULL OR m.unit_id = $2::int)
        AND ($3::date IS NULL OR tl.completion_date >= $3::date)
        AND ($4::date IS NULL OR tl.completion_date <= $4::date)
      ORDER BY tl.completion_date DESC;
    `;

    const params = [
      member_id ? parseInt(member_id) : null,
      unit_id ? parseInt(unit_id) : null,
      start_date || null,
      end_date || null
    ];

    const result = await db.query(sql, params);
    return successResponse(res, { count: result.rowCount, logs: result.rows });
  } catch (err) {
    console.error('Error fetching training history:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// ✅ 4. Upcoming Training
exports.getUpcomingTraining = async (req, res) => {
  try {
    const { unit_id } = req.query;

    const sql = `
      SELECT te.id, te.title, te.date, te.start_time, te.end_time,
             m.first_name || ' ' || m.last_name AS instructor_name
      FROM training_events te
      JOIN members m ON m.id = te.instructor_id
      WHERE te.date >= CURRENT_DATE
        AND ($1::int IS NULL OR m.unit_id = $1::int)
      ORDER BY te.date ASC;
    `;

    const result = await db.query(sql, [unit_id ? parseInt(unit_id) : null]);
    return successResponse(res, { count: result.rowCount, events: result.rows });
  } catch (err) {
    console.error('Error fetching upcoming training:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// ✅ 5. Task Compliance (Nuanced)
exports.getTaskCompliance = async (req, res) => {
  try {
    // TODO: Add SQL aggregation logic
    return successResponse(res, { message: 'Task compliance report coming soon' });
  } catch (err) {
    console.error('Error fetching task compliance report:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// ✅ 6. Certification Risk (Expiring Soon)
exports.getCertificationRisk = async (req, res) => {
  try {
    // TODO: Add SQL aggregation logic
    return successResponse(res, { message: 'Certification risk report coming soon' });
  } catch (err) {
    console.error('Error fetching certification risk report:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};
```


## taskCompetencyLinksController.js
```javascript
const db = require('../db');
const { successResponse, errorResponse } = require('../utils/response');

// GET /api/task-competency-links
exports.getAllLinks = async (req, res) => {
  const { competency, task } = req.query;
  console.log('GET /api/task-competency-links', { competency, task });
  
  // Build dynamic WHERE clause if filters provided
  let sql = 'SELECT * FROM task_competency_links';
  const params = [];
  const clauses = [];

  if (competency) {
    params.push(competency);
    clauses.push(`competency_id = $${params.length}`);
  }
  if (task) {
    params.push(task);
    clauses.push(`task_id = $${params.length}`);
  }
  if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
  sql += ' ORDER BY competency_id, task_id';

  try {
    const result = await db.query(sql, params);
    return successResponse(res, result.rows, 200);
  } catch (err) {
    console.error('Error fetching links:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// GET /api/task-competency-links/:id
exports.getLinkById = async (req, res) => {
  const { id } = req.params;
  console.log(`GET /api/task-competency-links/${id}`);
  try {
    const result = await db.query(
      'SELECT * FROM task_competency_links WHERE id = $1',
      [id]
    );
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Link not found' }, 404);
    }
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error fetching link:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// POST /api/task-competency-links
exports.createLink = async (req, res) => {
  console.log('POST /api/task-competency-links', req.body);
  const { task_id, competency_id, certification_phase, recurrence_type } = req.body;

  if (!task_id || !competency_id || !certification_phase || !recurrence_type) {
    return errorResponse(res, { message: 'Missing required fields: task_id, competency_id, certification_phase, recurrence_type' }, 400);
  }

  try {
    const result = await db.query(
      `INSERT INTO task_competency_links
         (task_id, competency_id, certification_phase, recurrence_type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [task_id, competency_id, certification_phase, recurrence_type]
    );
    return successResponse(res, result.rows[0], 201);
  } catch (err) {
    console.error('Error creating link:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// DELETE /api/task-competency-links/:id
exports.deleteLink = async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /api/task-competency-links/${id}`);
  try {
    const result = await db.query(
      'DELETE FROM task_competency_links WHERE id = $1 RETURNING *',
      [id]
    );
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Link not found' }, 404);
    }
    return successResponse(res, { message: 'Link deleted' }, 200);
  } catch (err) {
    console.error('Error deleting link:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};
```


## taskLogsController.js
```javascript
const db = require('../db');
const { successResponse, errorResponse } = require('../utils/response');

// GET all task logs
exports.getAllLogs = async (req, res) => {
  try {
    const { member_id, task_id, competency_id, start_date, end_date } = req.query;
    let sql = `
      SELECT tl.*, m.first_name AS member_first_name, m.last_name AS member_last_name,
             t.code AS task_code, t.title AS task_title
        FROM task_logs tl
        JOIN members m ON tl.member_id = m.id
        JOIN tasks t ON tl.task_id = t.id
    `;
    const conditions = [];
    const params = [];

    if (member_id) {
      params.push(member_id);
      conditions.push(`tl.member_id = $${params.length}`);
    }
    if (task_id) {
      params.push(task_id);
      conditions.push(`tl.task_id = $${params.length}`);
    }
    if (start_date) {
      params.push(start_date);
      conditions.push(`tl.completion_date >= $${params.length}`);
    }
    if (end_date) {
      params.push(end_date);
      conditions.push(`tl.completion_date <= $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY tl.completion_date DESC';

    const result = await db.query(sql, params);
    return successResponse(res, result.rows, 200);
  } catch (err) {
    console.error('Error fetching task logs:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// POST single or bulk task logs
exports.createLogs = async (req, res) => {
  const input = req.body;

  // Normalize input to array
  const logs = Array.isArray(input) ? input : [input];

  for (const log of logs) {
    if (!log.task_id || !log.member_id || !log.completion_date || !log.instructor_id) {
      return errorResponse(res, { message: 'Missing required fields in one or more objects' }, 400);
    }
  }

  try {
    const values = logs
      .map((l, idx) => `($${idx * 4 + 1}, $${idx * 4 + 2}, $${idx * 4 + 3}, $${idx * 4 + 4})`)
      .join(', ');

    const flatValues = logs.flatMap(l => [
      l.task_id,
      l.member_id,
      l.completion_date,
      l.instructor_id
    ]);

    const query = `
      INSERT INTO task_logs (task_id, member_id, completion_date, instructor_id)
      VALUES ${values}
      RETURNING *;
    `;

    const result = await db.query(query, flatValues);
    return successResponse(res, result.rows, 201);
  } catch (err) {
    console.error('Error creating task logs:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// DELETE a task log
exports.deleteLog = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM task_logs WHERE id = $1 RETURNING *', [id]);
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Log not found' }, 404);
    }
    return successResponse(res, { message: 'Task log deleted successfully' }, 200);
  } catch (err) {
    console.error('Error deleting task log:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};
```


## tasksController.js
```javascript
const db = require('../db');
const { successResponse, errorResponse } = require('../utils/response');

// GET all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks ORDER BY code ASC');
    return successResponse(res, result.rows, 200);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// GET task by ID
exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Task not found' }, 404);
    }
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error fetching task:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// POST new task
exports.createTask = async (req, res) => {
  const { code, title, description } = req.body;

  if (!code || !title) {
    return errorResponse(res, { message: 'Missing required fields: code, title' }, 400);
  }

  try {
    console.log('Creating task with data:', { code, title, description });
    const result = await db.query(
      'INSERT INTO tasks (code, title, description) VALUES ($1, $2, $3) RETURNING *',
      [code, title, description]
    );
    console.log('Inserted task result:', result.rows[0]);
    return successResponse(res, result.rows[0], 201);
  } catch (err) {
    console.error('Error creating task:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// PUT update task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { code, title, description } = req.body;

  if (!code || !title) {
    return errorResponse(res, { message: 'Missing required fields: code, title' }, 400);
  }

  try {
    const result = await db.query(
      'UPDATE tasks SET code = $1, title = $2, description = $3 WHERE id = $4 RETURNING *',
      [code, title, description, id]
    );
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Task not found' }, 404);
    }
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error updating task:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// DELETE task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Task not found' }, 404);
    }
    return successResponse(res, { message: 'Task deleted' }, 200);
  } catch (err) {
    console.error('Error deleting task:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};
```


## trainingEventAttendeesController.js
```javascript
const db = require('../db');
const { successResponse, errorResponse } = require('../utils/response');

// GET all
exports.getAllAttendees = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM training_event_attendees');
    return successResponse(res, result.rows, 200);
  } catch (err) {
    console.error('Error fetching attendees:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// GET by id
exports.getAttendeeById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('SELECT * FROM training_event_attendees WHERE id = $1', [id]);
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Attendee not found' }, 404);
    } 
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error fetching attendee:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// POST: Add one or many attendees
exports.addAttendee = async (req, res) => {
  const input = req.body;

  // Normalize input to array
  const attendees = Array.isArray(input) ? input : [input];

  // Validate all entries
  for (const a of attendees) {
    if (!a.training_event_id || !a.member_id) {
      return errorResponse(res, { message: 'Missing training_event_id or member_id in one or more objects' }, 400); 
    }
  }

  try {
    const insertValues = attendees.map(
      (a, idx) => `($${idx * 2 + 1}, $${idx * 2 + 2})`
    ).join(', ');

    const flatValues = attendees.flatMap(a => [a.training_event_id, a.member_id]);

    const query = `
      INSERT INTO training_event_attendees (training_event_id, member_id)
      VALUES ${insertValues}
      RETURNING *
    `;

    const result = await db.query(query, flatValues);
    return successResponse(res, result.rows, 201);
  } catch (err) {
    console.error('Error adding attendee(s):', err);
    return errorResponse(res, { message: 'Internal server error' }, 500);
  }
};


// PUT
exports.updateAttendee = async (req, res) => {
  const id = req.params.id;
  const { training_event_id, member_id } = req.body;

  if (!training_event_id || !member_id) {
      return errorResponse(res, { message: 'Missing training_event_id or member_id in one or more objects' }, 400); 
    }

  try {
    const result = await db.query(
      'UPDATE training_event_attendees SET training_event_id = $1, member_id = $2 WHERE id = $3 RETURNING *',
      [training_event_id, member_id, id]
    );
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Attendee not found' }, 404);
    }
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error updating attendee:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// DELETE
exports.deleteAttendee = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('DELETE FROM training_event_attendees WHERE id = $1 RETURNING *', [id]);
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Attendee not found' }, 404);
    } 
    return successResponse(res, { message: 'Attendee deleted successfully' }, 200);
  } catch (err) {
    console.error('Error deleting attendee:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};
```


## trainingEventsController.js
```javascript
const db = require('../db');
const { successResponse, errorResponse } = require('../utils/response');

// GET all training events
exports.getAllEvents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM training_events ORDER BY date DESC');
    return successResponse(res, result.rows, 200);
  } catch (err) {
    console.error('Error fetching training events:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// GET one event
exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM training_events WHERE id = $1', [id]);
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Event not found' }, 404);
    }
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error fetching event by ID:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// CREATE event
exports.createEvent = async (req, res) => {
  const { title, description, date, start_time, end_time, instructor_id, competency_id, created_by, visibility } = req.body;
  
  if (!title || !date || !start_time || !end_time || !instructor_id || !competency_id) {
    return errorResponse(res, { message: 'Missing required fields: title, date, start_time, end_time, instructor_ id, competency_id' }, 400);
  }

  try {
    const result = await db.query(
      `INSERT INTO training_events 
        (title, description, date, start_time, end_time, instructor_id, competency_id, created_by, visibility)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [title, description, date, start_time, end_time, instructor_id, competency_id, created_by, visibility]
    );
    return successResponse(res, result.rows[0], 201);
  } catch (err) {
    console.error('Error creating training event:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// UPDATE event
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, start_time, end_time, instructor_id, competency_id, visibility } = req.body;
  
  if (!title || !date || !start_time || !end_time || !instructor_id || !competency_id) {
    return errorResponse(res, { message: 'Missing required fields: title, date, start_time, end_time, instructor_ id, competency_id' }, 400);
  }
  
  try {
    const result = await db.query(
      `UPDATE training_events SET 
        title = $1, description = $2, date = $3, start_time = $4, end_time = $5, 
        instructor_id = $6, competency_id = $7, visibility = $8
       WHERE id = $9 RETURNING *`,
      [title, description, date, start_time, end_time, instructor_id, competency_id, visibility, id]
    );
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Event not found' }, 400);
    }
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error updating training event:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// DELETE event
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM training_events WHERE id = $1 RETURNING *', [id]);
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Event not found' }, 404);
    }
    return successResponse(res, { message: 'Event deleted successfully' }, 200);
  } catch (err) {
    console.error('Error deleting training event:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};
```


# **MIDDLEWARE**

## auditMiddleware.js
```javascript
const { logAction } = require('../utils/auditLogger');

function withAudit(targetTable) {
  return async (req, res, next) => {
    const originalSend = res.send;

    res.send = async function (body) {
      originalSend.call(this, body);

      try {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const actionMap = { POST: 'CREATE', PUT: 'UPDATE', DELETE: 'DELETE' };
          const action = actionMap[req.method];

          if (action) {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;

            await logAction(
              req.user?.id || null,
              action,
              targetTable,
              parsedBody?.id || null,
              req.body,           // Original request data
              req.user || {}      // Full JWT payload
            );
          }
        }
      } catch (err) {
        console.error('Audit log error:', err);
      }
    };

    next();
  };
}

module.exports = { withAudit };
```


## auth.js
```javascript
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verify Token
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"
    if (!token) return res.status(401).json({ message: 'Access token required' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user; // {id, role}
        next();
    });
}

// Role-based Authorization
function authorize(roles = []) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}

module.exports = { authenticate, authorize };
```


# **UTILITIES**

## auditLogger.js
```javascript
const db = require('../db');

async function logAction(userId, action, targetTable, targetId, changeData, userContext) {
  const logPayload = {
    request_body: changeData,
    user_context: userContext
  };

  const query = `
    INSERT INTO audit_log (user_id, action, target_table, target_id, change_data)
    VALUES ($1, $2, $3, $4, $5)
  `;
  await db.query(query, [userId, action, targetTable, targetId, logPayload]);
}

module.exports = { logAction };
```


## response.js
```javascript
exports.successResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data
  });
};

exports.errorResponse = (res, message, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: message
  });
};
```


# POSTMAN COLLECTION

## Cadre_API_Postman_Collection_Extended.json
```json
{
  "info": {
    "_postman_id": "dfc21a56-08e4-4d8c-805b-2a903a0e7d38",
    "name": "Cadre API Collection",
    "description": "Postman collection for testing Cadre API endpoints",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    "_exporter_id": "46660940",
    "_collection_link": "https://aaronkane-4786949.postman.co/workspace/Aaron-Kane's-Workspace~3305ff56-dbbc-4baf-831c-3d448459fbc3/collection/46660940-dfc21a56-08e4-4d8c-805b-2a903a0e7d38?action=share&source=collection_link&creator=46660940"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.environment.set(\"token\", pm.response.json().token);",
                  "pm.test(\"Status code is 200\", function () { pm.response.to.have.status(200); });"
                ],
                "type": "text/javascript",
                "packages": {}
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"kaneadmin\",\n  \"password\": \"P@ssword1\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "auth",
                "login"
              ]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Members",
      "item": [
        {
          "name": "Get All Members",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/members",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "members"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Get Member By ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/members/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "members",
                "1"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Create Member",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"first_name\": \"John\",\n  \"last_name\": \"Doe\",\n  \"employee_id\": \"12345\",\n  \"unit_id\": 1,\n  \"email\": \"john.doe@example.com\",\n  \"rate_rank\": \"E-5\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/members",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "members"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Update Member",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"first_name\": \"John\",\n  \"last_name\": \"Smith\",\n  \"employee_id\": \"12345\",\n  \"unit_id\": 1,\n  \"email\": \"john.smith@example.com\",\n  \"rate_rank\": \"E-6\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/members/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "members",
                "1"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Delete Member",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/members/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "members",
                "1"
              ]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Tasks",
      "item": [
        {
          "name": "Get All Tasks",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/tasks",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "tasks"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Get Task By ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/tasks/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "tasks",
                "1"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Create Task",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"code\": \"TASK001\",\n  \"title\": \"Sample Task\",\n  \"description\": \"Task description\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/tasks",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "tasks"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Update Task",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"code\": \"TASK001\",\n  \"title\": \"Updated Task\",\n  \"description\": \"Updated description\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/tasks/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "tasks",
                "1"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Delete Task",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/tasks/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "tasks",
                "1"
              ]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Competencies",
      "item": [
        {
          "name": "Get All Competencies",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/competencies",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "competencies"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Get Competency By ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/competencies/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "competencies",
                "1"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Create Competency",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"code\": \"COMP001\",\n  \"title\": \"Sample Competency\",\n  \"description\": \"Description\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/competencies",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "competencies"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Update Competency",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"code\": \"COMP001\",\n  \"title\": \"Updated Competency\",\n  \"description\": \"Updated description\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/competencies/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "competencies",
                "1"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Delete Competency",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/competencies/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "competencies",
                "1"
              ]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Certifications",
      "item": [
        {
          "name": "Get All Certifications",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/certifications",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "certifications"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Get Certification By ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/certifications/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "certifications",
                "1"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Create Certification",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"member_id\": 1,\n  \"competency_id\": 1,\n  \"certified_by\": 1,\n  \"certification_phase\": \"initial\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/certifications",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "certifications"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Update Certification Status",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"expired\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/certifications/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "certifications",
                "1"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Delete Certification",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/certifications/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "certifications",
                "1"
              ]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Task-Competency Links",
      "item": [
        {
          "name": "Get All Links",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/task-competency-links",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "task-competency-links"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Get Link By ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/task-competency-links/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "task-competency-links",
                "1"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Create Link",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"task_id\": 1,\n  \"competency_id\": 1,\n  \"certification_phase\": \"initial\",\n  \"recurrence_type\": \"annual\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/task-competency-links",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "task-competency-links"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Delete Link",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/task-competency-links/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "task-competency-links",
                "1"
              ]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Task Logs",
      "item": [
        {
          "name": "Get All Task Logs",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/task-logs",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "task-logs"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Create Task Logs",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "[\n  {\n    \"task_id\": 1,\n    \"member_id\": 1,\n    \"date_completed\": \"2025-07-17\",\n    \"instructor_id\": 1\n  }\n]"
            },
            "url": {
              "raw": "{{base_url}}/task-logs",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "task-logs"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Delete Task Log",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/task-logs/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "task-logs",
                "1"
              ]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Training Events",
      "item": [
        {
          "name": "Get All Training Events",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/training-events",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "training-events"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Get Training Event By ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/training-events/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "training-events",
                "1"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Create Training Event",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Sample Event\",\n  \"description\": \"Event description\",\n  \"date\": \"2025-07-17\",\n  \"start_time\": \"08:00\",\n  \"end_time\": \"12:00\",\n  \"instructor_id\": 1,\n  \"competency_id\": 1,\n  \"created_by\": 1,\n  \"visibility\": \"unit\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/training-events",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "training-events"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Update Training Event",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Updated Event\",\n  \"description\": \"Updated description\",\n  \"date\": \"2025-07-18\",\n  \"start_time\": \"09:00\",\n  \"end_time\": \"13:00\",\n  \"instructor_id\": 1,\n  \"competency_id\": 1,\n  \"visibility\": \"command\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/training-events/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "training-events",
                "1"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Delete Training Event",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/training-events/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "training-events",
                "1"
              ]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Training Event Attendees",
      "item": [
        {
          "name": "Get All Attendees",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/training-event-attendees",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "training-event-attendees"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Get Attendee By ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/training-event-attendees/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "training-event-attendees",
                "1"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Add Attendee(s)",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "[\n  {\n    \"training_event_id\": 1,\n    \"member_id\": 1\n  }\n]"
            },
            "url": {
              "raw": "{{base_url}}/training-event-attendees",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "training-event-attendees"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Update Attendee",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"training_event_id\": 1,\n  \"member_id\": 2\n}"
            },
            "url": {
              "raw": "{{base_url}}/training-event-attendees/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "training-event-attendees",
                "1"
              ]
            }
          },
          "response": []
        },
        {
          "name": "Delete Attendee",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/training-event-attendees/1",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "training-event-attendees",
                "1"
              ]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Reports",
      "item": [
        {
          "name": "Unit Readiness",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/reports/unit-readiness",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "reports",
                "unit-readiness"
              ]
            }
          }
        },
        {
          "name": "Competency Summary",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/reports/competency-summary",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "reports",
                "competency-summary"
              ]
            }
          }
        },
        {
          "name": "Training History",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/reports/training-history",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "reports",
                "training-history"
              ]
            }
          }
        },
        {
          "name": "Upcoming Training",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/reports/upcoming-training",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "reports",
                "upcoming-training"
              ]
            }
          }
        },
        {
          "name": "Task Compliance",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/reports/task-compliance",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "reports",
                "task-compliance"
              ]
            }
          }
        },
        {
          "name": "Certification Risk",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{base_url}}/reports/certification-risk",
              "host": [
                "{{base_url}}"
              ],
              "path": [
                "reports",
                "certification-risk"
              ]
            }
          }
        }
      ]
    }
  ],
  "event": [
    {
      "listen": "prerequest",
      "script": {
        "type": "text/javascript",
        "packages": {},
        "exec": [
          "if (pm.environment.get(\"token\")) {\r",
          "    pm.request.headers.add({\r",
          "        key: \"Authorization\",\r",
          "        value: `Bearer ${pm.environment.get(\"token\")}`\r",
          "    });\r",
          "}\r",
          ""
        ]
      }
    },
    {
      "listen": "test",
      "script": {
        "type": "text/javascript",
        "packages": {},
        "exec": [
          ""
        ]
      }
    }
  ]
}
```




