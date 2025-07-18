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
