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
      `INSERT INTO certifications (member_id, competency_id, certified_by, certification_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [member_id, competency_id, certified_by, certification_date || new Date()]
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

  const allowedStatuses = ['active', 'expired', 'revoked'];
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
