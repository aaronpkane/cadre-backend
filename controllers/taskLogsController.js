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
      conditions.push(`tl.date_completed >= $${params.length}`);
    }
    if (end_date) {
      params.push(end_date);
      conditions.push(`tl.date_completed <= $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY tl.date_completed DESC';

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
    if (!log.task_id || !log.member_id || !log.date_completed || !log.instructor_id) {
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
      l.date_completed,
      l.instructor_id
    ]);

    const query = `
      INSERT INTO task_logs (task_id, member_id, date_completed, instructor_id)
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
