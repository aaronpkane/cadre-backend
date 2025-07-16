const db = require('../db');

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
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching task logs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST single or bulk task logs
exports.createLogs = async (req, res) => {
  const input = req.body;

  // Normalize input to array
  const logs = Array.isArray(input) ? input : [input];

  for (const log of logs) {
    if (!log.task_id || !log.member_id || !log.date_completed || !log.instructor_id) {
      return res.status(400).json({ error: 'Missing required fields in one or more objects' });
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
    res.status(201).json(result.rows);
  } catch (err) {
    console.error('Error creating task logs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE a task log
exports.deleteLog = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM task_logs WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.json({ message: 'Task log deleted successfully' });
  } catch (err) {
    console.error('Error deleting task log:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
