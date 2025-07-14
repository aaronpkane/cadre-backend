const db = require('../db');

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
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching links:', err);
    res.status(500).json({ error: 'Internal server error' });
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
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching link:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/task-competency-links
exports.createLink = async (req, res) => {
  console.log('POST /api/task-competency-links', req.body);
  const { task_id, competency_id, certification_phase, recurrence_type } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO task_competency_links
         (task_id, competency_id, certification_phase, recurrence_type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [task_id, competency_id, certification_phase, recurrence_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating link:', err);
    res.status(500).json({ error: 'Internal server error' });
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
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    res.json({ message: 'Link deleted' });
  } catch (err) {
    console.error('Error deleting link:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
