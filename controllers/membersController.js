// This file defines the controller for member-related operations.
// It handles the logic for fetching all members from the database.

const db = require('../db');

// GET all members
exports.getAllMembers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM members ORDER BY last_name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching members' });
  }
};

// GET member by ID
exports.getMemberById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM members WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching member:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST new member
exports.createMember = async (req, res) => {
  const { first_name, last_name, employee_id, unit_id, email, rate_rank } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO members (first_name, last_name, employee_id, unit_id, email, rate_rank) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [first_name, last_name, employee_id, unit_id, email, rate_rank]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating member:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT update member
exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, employee_id, unit_id, email, rate_rank } = req.body;
  try {
    const result = await db.query(
      'UPDATE members SET first_name = $1, last_name = $2, employee_id = $3, unit_id = $4, email = $5, rate_rank = $6 WHERE id = $7 RETURNING *',
      [first_name, last_name, employee_id, unit_id, email, rate_rank, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Member not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating member:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE member
exports.deleteMember = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM members WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Member deleted' });
  } catch (err) {
    console.error('Error deleting member:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};