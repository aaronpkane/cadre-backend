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
