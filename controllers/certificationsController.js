const db = require('../db');

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
    sql += ' ORDER BY date_certified DESC';

    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching certifications:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET one certification
exports.getCertificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM certifications WHERE id = $1', [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Certification not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching certification:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST: Create certification (with validation)
exports.createCertification = async (req, res) => {
  const { member_id, competency_id, certified_by, date_certified } = req.body;

  try {
    // 1. Fetch required initial-phase tasks for this competency
    const requiredTasks = await db.query(
      `SELECT task_id FROM task_competency_links
        WHERE competency_id = $1 AND certification_phase = 'initial'`,
      [competency_id]
    );

    if (!requiredTasks.rows.length) {
      return res.status(400).json({ error: 'No initial-phase tasks found for this competency' });
    }

    const taskIds = requiredTasks.rows.map(row => row.task_id);

    // 2. Check if member has completed all required tasks
    const completedTasks = await db.query(
      `SELECT DISTINCT task_id FROM task_logs
        WHERE member_id = $1 AND task_id = ANY($2::int[])`,
      [member_id, taskIds]
    );

    if (completedTasks.rows.length < taskIds.length) {
      return res.status(400).json({ 
        error: 'Member has not completed all required tasks for this competency',
        details: {
          required_tasks: taskIds,
          completed_tasks: completedTasks.rows.map(r => r.task_id)
        }
      });
    }

    // 3. Insert certification
    const result = await db.query(
      `INSERT INTO certifications (member_id, competency_id, certified_by, date_certified)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [member_id, competency_id, certified_by, date_certified || new Date()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating certification:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE certification
exports.deleteCertification = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM certifications WHERE id = $1 RETURNING *', [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Certification not found' });
    res.json({ message: 'Certification removed successfully' });
  } catch (err) {
    console.error('Error deleting certification:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
