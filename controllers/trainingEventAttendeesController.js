const db = require('../db');

// GET all
exports.getAllAttendees = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM training_event_attendees');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching attendees:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET by id
exports.getAttendeeById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('SELECT * FROM training_event_attendees WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Attendee not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching attendee:', err);
    res.status(500).json({ error: 'Internal server error' });
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
      return res.status(400).json({ error: 'Missing training_event_id or member_id in one or more objects' });
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
    res.status(201).json(result.rows);
  } catch (err) {
    console.error('Error adding attendee(s):', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// PUT
exports.updateAttendee = async (req, res) => {
  const id = req.params.id;
  const { training_event_id, member_id } = req.body;
  try {
    const result = await db.query(
      'UPDATE training_event_attendees SET training_event_id = $1, member_id = $2 WHERE id = $3 RETURNING *',
      [training_event_id, member_id, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Attendee not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating attendee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE
exports.deleteAttendee = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('DELETE FROM training_event_attendees WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Attendee not found' });
    res.json({ message: 'Attendee deleted successfully' });
  } catch (err) {
    console.error('Error deleting attendee:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
