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
