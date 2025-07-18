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
