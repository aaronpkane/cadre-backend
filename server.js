const express = require('express');
// DB instance available for future server-level queries
const db = require('./db');
const app = express();

require('dotenv').config();

app.use(express.json());

const memberRoutes = require('./routes/members');
app.use('/api/members', memberRoutes);

const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.send('Cadre backend is running');
});

app.get('/test', (req, res) => {
  res.send('✅ Test route works');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});
