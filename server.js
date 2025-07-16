const express = require('express');
const db = require('./db'); // DB instance available for future server-level queries
const app = express();

require('dotenv').config();

app.use(express.json());

// Member Routes hook
const memberRoutes = require('./routes/members');
app.use('/api/members', memberRoutes); // Members Routes hook

const taskRoutes = require('./routes/tasks');
app.use('/api/tasks', taskRoutes); // Task Routes hook

const competencyRoutes = require('./routes/competencies');
app.use('/api/competencies', competencyRoutes); // Competency Routes hook

const linkRoutes = require('./routes/taskCompetencyLinks');
app.use('/api/task-competency-links', linkRoutes); // Task-Competency Link Routes hook

const trainingEventRoutes = require('./routes/trainingEvents');
app.use('/api/training-events', trainingEventRoutes); // Training Event Routes hook

const trainingEventAttendeesRoutes = require('./routes/trainingEventAttendees');
app.use('/api/training-event-attendees', trainingEventAttendeesRoutes); // Training Event Attendees Routes hook

const taskLogRoutes = require('./routes/taskLogs');
app.use('/api/task-logs', taskLogRoutes); // Task Logs Routes hook

const certificationRoutes = require('./routes/certifications');
app.use('/api/certifications', certificationRoutes); // Certifications Routes hook

const authRoutes = require('./routes/auth'); 
app.use('/api/auth', authRoutes); // Auth Routes hook

// Backend Health check route
app.get('/', (req, res) => {
  res.send('Cadre backend is running');
});

// Uncomment for testing purposes
//app.get('/test', (req, res) => {
  //res.send('✅ Test route works');
//});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server live on port ${PORT}`);
});
