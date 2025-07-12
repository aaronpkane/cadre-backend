const db = require('../db');

// GET /api/competencies
exports.getAllCompetencies = async (req, res) => {
  console.log('GET /api/competencies');
  try {
    const result = await db.query(
      'SELECT * FROM competencies ORDER BY code ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching competencies:', err);
    res.status(500).json({ error: 'Internal server error' });
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
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Competency not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching competency:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/competencies
exports.createCompetency = async (req, res) => {
  console.log('POST /api/competencies', req.body);
  const { code, title, description } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO competencies (code, title, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [code, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating competency:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/competencies/:id
exports.updateCompetency = async (req, res) => {
  const { id } = req.params;
  console.log(`PUT /api/competencies/${id}`, req.body);
  const { code, title, description } = req.body;
  try {
    const result = await db.query(
      `UPDATE competencies
       SET code = $1, title = $2, description = $3
       WHERE id = $4
       RETURNING *`,
      [code, title, description, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Competency not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating competency:', err);
    res.status(500).json({ error: 'Internal server error' });
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
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Competency not found' });
    }
    res.json({ message: 'Competency deleted' });
  } catch (err) {
    console.error('Error deleting competency:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
