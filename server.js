const express = require('express');
const db = require('./db');
const app = express();
require('dotenv').config();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Cadre backend is running');
});

app.get('/test', (req, res) => {
  res.send('✅ Test route works');
});

app.get('/api/members', async (req, res) => {
  console.log('🔍 /api/members route hit');
  try {
    const result = await db.query('SELECT * FROM members ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});
