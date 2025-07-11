// This file defines the controller for task-related operations.
// It handles the logic for fetching, creating, updating, and deleting tasks.

const db = require('../db');

// GET all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks ORDER BY code ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET task by ID
exports.getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST new task
exports.createTask = async (req, res) => {
  const { code, title, description } = req.body;
  try {
    console.log('Creating task with data:', { code, title, description });
    const result = await db.query(
      'INSERT INTO tasks (code, title, description) VALUES ($1, $2, $3) RETURNING *',
      [code, title, description]
    );
    console.log('Inserted task result:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT update task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { code, title, description } = req.body;
  try {
    const result = await db.query(
      'UPDATE tasks SET code = $1, title = $2, description = $3 WHERE id = $4 RETURNING *',
      [code, title, description, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
