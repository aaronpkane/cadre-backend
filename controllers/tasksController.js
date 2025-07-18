// This file defines the controller for task-related operations.
// It handles the logic for fetching, creating, updating, and deleting tasks.

const db = require('../db');
const { successResponse, errorResponse } = require('../utils/response');

// GET all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks ORDER BY code ASC');
    return successResponse(res, result.rows, 200);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// GET task by ID
exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Task not found' }, 404);
    }
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error fetching task:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// POST new task
exports.createTask = async (req, res) => {
  const { code, title, description } = req.body;

  if (!code || !title) {
    return errorResponse(res, { message: 'Missing required fields: code, title' }, 400);
  }

  try {
    console.log('Creating task with data:', { code, title, description });
    const result = await db.query(
      'INSERT INTO tasks (code, title, description) VALUES ($1, $2, $3) RETURNING *',
      [code, title, description]
    );
    console.log('Inserted task result:', result.rows[0]);
    return successResponse(res, result.rows[0], 201);
  } catch (err) {
    console.error('Error creating task:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// PUT update task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { code, title, description } = req.body;

  if (!code || !title) {
    return errorResponse(res, { message: 'Missing required fields: code, title' }, 400);
  }

  try {
    const result = await db.query(
      'UPDATE tasks SET code = $1, title = $2, description = $3 WHERE id = $4 RETURNING *',
      [code, title, description, id]
    );
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Task not found' }, 404);
    }
    return successResponse(res, result.rows[0], 200);
  } catch (err) {
    console.error('Error updating task:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// DELETE task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (!result.rows.length) {
      return errorResponse(res, { message: 'Task not found' }, 404);
    }
    return successResponse(res, { message: 'Task deleted' }, 200);
  } catch (err) {
    console.error('Error deleting task:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};
