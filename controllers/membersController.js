// This file defines the controller for member-related operations.
// It handles the logic for fetching all members from the database.

const db = require('../db');
const { successResponse, errorResponse } = require('../utils/response');

// GET all members
exports.getAllMembers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM members ORDER BY last_name ASC');
    return successResponse(res, result.rows, 200);
  } catch (err) {
    console.error('Error fetching members:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// GET member by ID
exports.getMemberById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM members WHERE id = $1', [id]);
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Member not found' }, 404);
    }
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error fetching member:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// POST new member
exports.createMember = async (req, res) => {
  const { first_name, last_name, employee_id, unit_id, email, rate_rank } = req.body;

  if (!first_name || !last_name || !employee_id || !unit_id) {
  return errorResponse(res, { message: 'Missing required fields: first_name, last_name, employee_id, unit_id' }, 400);
}

  try {
    const result = await db.query(
      'INSERT INTO members (first_name, last_name, employee_id, unit_id, email, rate_rank) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [first_name, last_name, employee_id, unit_id, email, rate_rank]
    );
    return successResponse(res, result.rows[0], 201);
  } catch (err) {
    console.error('Error creating member:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// PUT update member
exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, employee_id, unit_id, email, rate_rank } = req.body;

  if (!first_name || !last_name || !employee_id || !unit_id) {
  return errorResponse(res, { message: 'Missing required fields: first_name, last_name, employee_id, unit_id' }, 400);
}

  try {
    const result = await db.query(
      'UPDATE members SET first_name = $1, last_name = $2, employee_id = $3, unit_id = $4, email = $5, rate_rank = $6 WHERE id = $7 RETURNING *',
      [first_name, last_name, employee_id, unit_id, email, rate_rank, id]
    );
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Member not found' }, 404);
    } 
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error updating member:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// DELETE member
exports.deleteMember = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM members WHERE id = $1 RETURNING *', [id]);
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Member not found' }, 404);
    }
    return successResponse(res, { message: 'Member deleted' }, 200);
  } catch (err) {
    console.error('Error deleting member:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};