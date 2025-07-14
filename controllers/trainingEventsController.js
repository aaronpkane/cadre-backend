const db = require('../db');

// GET all training events
exports.getAllEvents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM training_events ORDER BY date DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching training events:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET one event
exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM training_events WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching event by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// CREATE event
exports.createEvent = async (req, res) => {
  const { title, description, date, start_time, end_time, instructor_id, competency_id, created_by, visibility } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO training_events 
        (title, description, date, start_time, end_time, instructor_id, competency_id, created_by, visibility)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [title, description, date, start_time, end_time, instructor_id, competency_id, created_by, visibility]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating training event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATE event
exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, start_time, end_time, instructor_id, competency_id, visibility } = req.body;
  try {
    const result = await db.query(
      `UPDATE training_events SET 
        title = $1, description = $2, date = $3, start_time = $4, end_time = $5, 
        instructor_id = $6, competency_id = $7, visibility = $8
       WHERE id = $9 RETURNING *`,
      [title, description, date, start_time, end_time, instructor_id, competency_id, visibility, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating training event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE event
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM training_events WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting training event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
