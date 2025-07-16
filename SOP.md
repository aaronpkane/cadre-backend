# STANDARD OPERATING PROCEDURE (SOP) FOR CADRE

## Project Overview
Cadre is a **modernized training management system** that enables users to manage robust **competency-based training programs**. It tracks:
- Users
- Roles
- Units
- Members
- Assignments
- Competencies
- Tasks
- Task completions
- Task-Competency links
- Training Events & Attendees
- Task Logs
- Certifications
- Audit Logging
- Role-based access control

**Mission Statement:** To enable frictionless training management.

## Direction for AI
Assume I am a total beginner with zero coding experience. Assume I’m stuck in a mental echo chamber. I want you to pry it open. Identify the blind spots in my reasoning, the assumptions I treat as facts, and the narratives I’ve subconsciously internalized. Don’t just play devil’s advocate—be a ruthless but respectful collaborator who seeks truth above comfort. Challenge my ideas with precision, offer unfamiliar perspectives, and if I’m playing it safe, tell me. Assume I want to grow, not be coddled. I want you to challenge my thinking. From now on, don’t validate my ideas by default. Challenge them. Point out weak logic, lazy assumptions, or echo chamber thinking. Think with me and not for me. I want you to help me develop better points overall and not just immediately run with and execute bad ideas. Develop your plan of action *linearly*, so that we can move from point A to point B. I do not want to double back to add features for things that we have previously completed.

---

## Database Schema

### **users**
                                          Table "public.users"
    Column     |            Type             | Collation | Nullable |              Default
---------------+-----------------------------+-----------+----------+-----------------------------------
 id            | integer                     |           | not null | nextval('users_id_seq'::regclass)
 password_hash | text                        |           | not null |
 email         | character varying(255)      |           | not null |
 role_id       | integer                     |           |          |
 unit_id       | integer                     |           |          |
 created_at    | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 username      | character varying(50)       |           | not null |
 last_login    | timestamp without time zone |           |          |
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_email_key" UNIQUE CONSTRAINT, btree (email)
    "users_username_key" UNIQUE CONSTRAINT, btree (username)
Foreign-key constraints:
    "users_role_id_fkey" FOREIGN KEY (role_id) REFERENCES roles(id)
    "users_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES units(id)
Referenced by:
    TABLE "assignments" CONSTRAINT "assignments_assigned_by_fkey" FOREIGN KEY (assigned_by) REFERENCES users(id)
    TABLE "audit_log" CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
    TABLE "certifications" CONSTRAINT "certifications_certified_by_fkey" FOREIGN KEY (certified_by) REFERENCES users(id)
    TABLE "task_logs" CONSTRAINT "task_logs_completed_by_fkey" FOREIGN KEY (completed_by) REFERENCES users(id)
    TABLE "training_events" CONSTRAINT "training_events_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id)

### **roles**
                                         Table "public.roles"
   Column    |            Type             | Collation | Nullable |              Default
-------------+-----------------------------+-----------+----------+-----------------------------------
 id          | integer                     |           | not null | nextval('roles_id_seq'::regclass)
 name        | character varying(50)       |           | not null |
 description | text                        |           |          |
 created_at  | timestamp without time zone |           |          | CURRENT_TIMESTAMP
Indexes:
    "roles_pkey" PRIMARY KEY, btree (id)
    "roles_name_key" UNIQUE CONSTRAINT, btree (name)
Referenced by:
    TABLE "users" CONSTRAINT "users_role_id_fkey" FOREIGN KEY (role_id) REFERENCES roles(id)

### **units**
                                          Table "public.units"
    Column     |            Type             | Collation | Nullable |              Default
---------------+-----------------------------+-----------+----------+-----------------------------------
 id            | integer                     |           | not null | nextval('units_id_seq'::regclass)
 name          | character varying(100)      |           | not null |
 district_code | character varying(10)       |           |          |
 created_at    | timestamp without time zone |           |          | CURRENT_TIMESTAMP
Indexes:
    "units_pkey" PRIMARY KEY, btree (id)
    "units_name_key" UNIQUE CONSTRAINT, btree (name)
Referenced by:
    TABLE "members" CONSTRAINT "members_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES units(id)
    TABLE "users" CONSTRAINT "users_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES units(id)

### **members**
                                         Table "public.members"
   Column    |            Type             | Collation | Nullable |               Default
-------------+-----------------------------+-----------+----------+-------------------------------------
 id          | integer                     |           | not null | nextval('members_id_seq'::regclass)
 rate_rank   | character varying(10)       |           |          |
 first_name  | character varying(100)      |           |          |
 last_name   | character varying(100)      |           |          |
 employee_id | character varying(10)       |           |          |
 email       | character varying(255)      |           |          |
 created_at  | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 unit_id     | integer                     |           |          |
Indexes:
    "members_pkey" PRIMARY KEY, btree (id)
    "members_employee_id_key" UNIQUE CONSTRAINT, btree (employee_id)
Foreign-key constraints:
    "members_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES units(id)
Referenced by:
    TABLE "assignments" CONSTRAINT "assignments_member_id_fkey" FOREIGN KEY (member_id) REFERENCES members(id)
    TABLE "certifications" CONSTRAINT "certifications_member_id_fkey" FOREIGN KEY (member_id) REFERENCES members(id)
    TABLE "task_completions" CONSTRAINT "task_completions_member_id_fkey" FOREIGN KEY (member_id) REFERENCES members(id)
    TABLE "task_logs" CONSTRAINT "task_logs_member_id_fkey" FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
    TABLE "training_event_attendees" CONSTRAINT "training_event_attendees_member_id_fkey" FOREIGN KEY (member_id) REFERENCES members(id)
    TABLE "training_events" CONSTRAINT "training_events_instructor_id_fkey" FOREIGN KEY (instructor_id) REFERENCES members(id)

### **assignments**
                                          Table "public.assignments"
    Column     |            Type             | Collation | Nullable |                 Default
---------------+-----------------------------+-----------+----------+-----------------------------------------
 id            | integer                     |           | not null | nextval('assignments_id_seq'::regclass)
 member_id     | integer                     |           |          |
 competency_id | integer                     |           |          |
 assigned_at   | timestamp without time zone |           |          | CURRENT_TIMESTAMP
 assigned_by   | integer                     |           |          |
Indexes:
    "assignments_pkey" PRIMARY KEY, btree (id)
    "assignments_member_id_competency_id_key" UNIQUE CONSTRAINT, btree (member_id, competency_id)
Foreign-key constraints:
    "assignments_assigned_by_fkey" FOREIGN KEY (assigned_by) REFERENCES users(id)
    "assignments_competency_id_fkey" FOREIGN KEY (competency_id) REFERENCES competencies(id)
    "assignments_member_id_fkey" FOREIGN KEY (member_id) REFERENCES members(id)

### **competencies**
                                         Table "public.competencies"
   Column    |            Type             | Collation | Nullable |                 Default
-------------+-----------------------------+-----------+----------+------------------------------------------
 id          | integer                     |           | not null | nextval('competencies_id_seq'::regclass)
 code        | character varying(20)       |           | not null |
 title       | character varying(255)      |           | not null |
 description | text                        |           |          |
 created_at  | timestamp without time zone |           |          | CURRENT_TIMESTAMP
Indexes:
    "competencies_pkey" PRIMARY KEY, btree (id)
    "competencies_code_key" UNIQUE CONSTRAINT, btree (code)
Referenced by:
    TABLE "assignments" CONSTRAINT "assignments_competency_id_fkey" FOREIGN KEY (competency_id) REFERENCES competencies(id)
    TABLE "certifications" CONSTRAINT "certifications_competency_id_fkey" FOREIGN KEY (competency_id) REFERENCES competencies(id)
    TABLE "task_competency_links" CONSTRAINT "task_competency_links_competency_id_fkey" FOREIGN KEY (competency_id) REFERENCES competencies(id) ON DELETE CASCADE
    TABLE "training_events" CONSTRAINT "training_events_competency_id_fkey" FOREIGN KEY (competency_id) REFERENCES competencies(id)

### **tasks**
                                         Table "public.tasks"
   Column    |            Type             | Collation | Nullable |              Default
-------------+-----------------------------+-----------+----------+-----------------------------------
 id          | integer                     |           | not null | nextval('tasks_id_seq'::regclass)
 code        | character varying(20)       |           | not null |
 title       | character varying(255)      |           | not null |
 description | text                        |           |          |
 is_required | boolean                     |           |          | true
 created_at  | timestamp without time zone |           |          | CURRENT_TIMESTAMP
Indexes:
    "tasks_pkey" PRIMARY KEY, btree (id)
    "tasks_code_key" UNIQUE CONSTRAINT, btree (code)
Referenced by:
    TABLE "task_competency_links" CONSTRAINT "task_competency_links_task_id_fkey" FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    TABLE "task_completions" CONSTRAINT "task_completions_task_id_fkey" FOREIGN KEY (task_id) REFERENCES tasks(id)
    TABLE "task_logs" CONSTRAINT "task_logs_task_id_fkey" FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE

### **task_competency_links**
                                   Table "public.task_competency_links"
        Column        |  Type   | Collation | Nullable |                      Default
----------------------+---------+-----------+----------+---------------------------------------------------
 id                   | integer |           | not null | nextval('task_competency_links_id_seq'::regclass)
 task_id              | integer |           | not null |
 competency_id        | integer |           | not null |
 certification_phase  | text    |           |          | 'initial'::text
 recurrence_type      | text    |           |          |
 requires_fixed_cycle | boolean |           |          | true
 is_required          | boolean |           |          | true
Indexes:
    "task_competency_links_pkey" PRIMARY KEY, btree (id)
    "task_competency_links_unique" UNIQUE CONSTRAINT, btree (task_id, competency_id, certification_phase)
Check constraints:
    "task_competency_links_certification_phase_check" CHECK (certification_phase = ANY (ARRAY['initial'::text, 'recurrent'::text]))
    "task_competency_links_recurrence_type_check" CHECK (recurrence_type = ANY (ARRAY['permanent'::text, 'semiannual'::text, 'annual'::text, 'biennial'::text]))
Foreign-key constraints:
    "task_competency_links_competency_id_fkey" FOREIGN KEY (competency_id) REFERENCES competencies(id) ON DELETE CASCADE
    "task_competency_links_task_id_fkey" FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE

### **certifications**
                                   Table "public.certifications"
       Column        |  Type   | Collation | Nullable |                  Default
---------------------+---------+-----------+----------+--------------------------------------------
 id                  | integer |           | not null | nextval('certifications_id_seq'::regclass)
 member_id           | integer |           | not null |
 competency_id       | integer |           | not null |
 certified_by        | integer |           |          |
 certification_date  | date    |           | not null |
 status              | text    |           |          | 'active'::text
 certification_phase | text    |           | not null |
Indexes:
    "certifications_pkey" PRIMARY KEY, btree (id)
Check constraints:
    "certifications_certification_phase_check" CHECK (certification_phase = ANY (ARRAY['initial'::text, 'recurrent'::text]))
    "certifications_status_check" CHECK (status = ANY (ARRAY['active'::text, 'expired'::text, 'revoked'::text]))
Foreign-key constraints:
    "certifications_certified_by_fkey" FOREIGN KEY (certified_by) REFERENCES users(id)
    "certifications_competency_id_fkey" FOREIGN KEY (competency_id) REFERENCES competencies(id)
    "certifications_member_id_fkey" FOREIGN KEY (member_id) REFERENCES members(id)

### **training_events**
                                       Table "public.training_events"
    Column     |          Type          | Collation | Nullable |                   Default
---------------+------------------------+-----------+----------+---------------------------------------------
 id            | integer                |           | not null | nextval('training_events_id_seq'::regclass)
 title         | text                   |           | not null |
 description   | text                   |           |          |
 date          | date                   |           | not null |
 start_time    | time without time zone |           |          |
 end_time      | time without time zone |           |          |
 instructor_id | integer                |           |          |
 competency_id | integer                |           |          |
 created_by    | integer                |           |          |
 visibility    | text                   |           |          | 'unit'::text
Indexes:
    "training_events_pkey" PRIMARY KEY, btree (id)
Check constraints:
    "training_events_visibility_check" CHECK (visibility = ANY (ARRAY['unit'::text, 'command'::text, 'hq'::text]))
Foreign-key constraints:
    "training_events_competency_id_fkey" FOREIGN KEY (competency_id) REFERENCES competencies(id)
    "training_events_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id)
    "training_events_instructor_id_fkey" FOREIGN KEY (instructor_id) REFERENCES members(id)
Referenced by:
    TABLE "training_event_attendees" CONSTRAINT "training_event_attendees_training_event_id_fkey" FOREIGN KEY (training_event_id) REFERENCES training_events(id) ON DELETE CASCADE

### **training_event_attendees**
                                  Table "public.training_event_attendees"
      Column       |  Type   | Collation | Nullable |                       Default
-------------------+---------+-----------+----------+------------------------------------------------------
 id                | integer |           | not null | nextval('training_event_attendees_id_seq'::regclass)
 training_event_id | integer |           |          |
 member_id         | integer |           |          |
Indexes:
    "training_event_attendees_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "training_event_attendees_member_id_fkey" FOREIGN KEY (member_id) REFERENCES members(id)
    "training_event_attendees_training_event_id_fkey" FOREIGN KEY (training_event_id) REFERENCES training_events(id) ON DELETE CASCADE

### **task_logs**
                                   Table "public.task_logs"
       Column        |  Type   | Collation | Nullable |                Default
---------------------+---------+-----------+----------+---------------------------------------
 id                  | integer |           | not null | nextval('task_logs_id_seq'::regclass)
 task_id             | integer |           | not null |
 member_id           | integer |           | not null |
 completed_by        | integer |           |          |
 completion_date     | date    |           | not null |
 certification_phase | text    |           | not null |
 notes               | text    |           |          |
Indexes:
    "task_logs_pkey" PRIMARY KEY, btree (id)
Check constraints:
    "task_logs_certification_phase_check" CHECK (certification_phase = ANY (ARRAY['initial'::text, 'recurrent'::text]))
Foreign-key constraints:
    "task_logs_completed_by_fkey" FOREIGN KEY (completed_by) REFERENCES users(id)
    "task_logs_member_id_fkey" FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
    "task_logs_task_id_fkey" FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
Referenced by:
    TABLE "task_completions" CONSTRAINT "task_completions_most_recent_log_id_fkey" FOREIGN KEY (most_recent_log_id) REFERENCES task_logs(id)

### **audit_log**
                                         Table "public.audit_log"
    Column    |            Type             | Collation | Nullable |                Default
--------------+-----------------------------+-----------+----------+---------------------------------------
 id           | integer                     |           | not null | nextval('audit_log_id_seq'::regclass)
 user_id      | integer                     |           |          |
 action       | text                        |           |          |
 target_table | text                        |           |          |
 target_id    | integer                     |           |          |
 change_data  | jsonb                       |           |          |
 timestamp    | timestamp without time zone |           |          | CURRENT_TIMESTAMP
Indexes:
    "audit_log_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "audit_log_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

## Authentication & Authorization Implementation

### JWT Authentication Status
- Implemented `/api/auth/login` route with:
  - `bcrypt` for password verification
  - `jsonwebtoken` for token signing
  - Payload includes `{ id, role }`
- Tokens expire based on `JWT_EXPIRES_IN` in `.env`
- Signature verified with `JWT_SECRET`

**Sample JWT Payload:**
```json
{
  "id": 1,
  "role": "hq",
  "iat": 1681234567,
  "exp": 1681238167
}
```

---

### Role-Based Access Control (RBAC)
**Roles:**
- `hq` → Full access
- `command` → Manage certifications, schedule training
- `trainer` → Log tasks, view events

---

#### RBAC Matrix
| Route Group                       | Authenticate | Roles Allowed                                   |
|----------------------------------|-------------|------------------------------------------------|
| **/api/members**                | ✅          | HQ (full), Command (read)                     |
| **/api/tasks**                  | ✅          | HQ only for write                              |
| **/api/competencies**           | ✅          | HQ only for write                              |
| **/api/task-competency-links**  | ✅          | HQ only for write                              |
| **/api/training-events**        | ✅          | HQ & Command (create/update/delete), Trainer (read) |
| **/api/training-event-attendees**| ✅         | HQ & Command                                   |
| **/api/task-logs**              | ✅          | HQ, Command, Trainer                           |
| **/api/certifications**         | ✅          | HQ & Command (create), HQ (delete)            |

---

### Middleware
Use `authenticate` and `authorize`:
```javascript
const { authenticate, authorize } = require('../middleware/auth');
```

---

---

## API Routes Completed

### **Members**
- `GET /api/members` (all)
- `GET /api/members/:id`
- `POST /api/members`
- `PUT /api/members/:id`
- `DELETE /api/members/:id`

#### routes/members.js
const express = require('express');
const router = express.Router();
const membersController = require('../controllers/membersController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['hq','command']), membersController.getAllMembers);
router.get('/:id', authenticate, authorize(['hq','command']), membersController.getMemberById);
router.post('/', authenticate, authorize(['hq']), membersController.createMember);
router.put('/:id', authenticate, authorize(['hq']), membersController.updateMember);
router.delete('/:id', authenticate, authorize(['hq']), membersController.deleteMember);

module.exports = router;

#### controllers/membersController.js
const db = require('../db');

exports.getAllMembers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM members ORDER BY last_name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching members' });
  }
};

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

### **Tasks**
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

#### routes/tasks.js
const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['hq','command','trainer']), tasksController.getAllTasks);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), tasksController.getTaskById);
router.post('/', authenticate, authorize(['hq']), tasksController.createTask);
router.put('/:id', authenticate, authorize(['hq']), tasksController.updateTask);
router.delete('/:id', authenticate, authorize(['hq']), tasksController.deleteTask);

module.exports = router;

#### controllers/tasksController.js
const db = require('../db');

exports.getAllTasks = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks ORDER BY code ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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

### **Competencies**
- Full CRUD implemented

#### routes/competencies.js
const express = require('express');
const router = express.Router();
const competenciesController = require('../controllers/competenciesController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['hq','command','trainer']), competenciesController.getAllCompetencies);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), competenciesController.getCompetencyById);
router.post('/', authenticate, authorize(['hq']), competenciesController.createCompetency);
router.put('/:id', authenticate, authorize(['hq']), competenciesController.updateCompetency);
router.delete('/:id', authenticate, authorize(['hq']), competenciesController.deleteCompetency);

module.exports = router;

#### controllers/competenciesController.js
const db = require('../db');

exports.getAllCompetencies = async (req, res) => {
  console.log('GET /api/competencies');
  try {
    const result = await db.query(
      'SELECT * FROM competencies ORDER BY code ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching competencies:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCompetencyById = async (req, res) => {
  const { id } = req.params;
  console.log(`GET /api/competencies/${id}`);
  try {
    const result = await db.query(
      'SELECT * FROM competencies WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Competency not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching competency:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createCompetency = async (req, res) => {
  console.log('POST /api/competencies', req.body);
  const { code, title, description } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO competencies (code, title, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [code, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating competency:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateCompetency = async (req, res) => {
  const { id } = req.params;
  console.log(`PUT /api/competencies/${id}`, req.body);
  const { code, title, description } = req.body;
  try {
    const result = await db.query(
      `UPDATE competencies
       SET code = $1, title = $2, description = $3
       WHERE id = $4
       RETURNING *`,
      [code, title, description, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Competency not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating competency:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteCompetency = async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /api/competencies/${id}`);
  try {
    const result = await db.query(
      'DELETE FROM competencies WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Competency not found' });
    }
    res.json({ message: 'Competency deleted' });
  } catch (err) {
    console.error('Error deleting competency:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

### **Task-Competency Links**
- `GET /api/task-competency-links` (filters: competency, task)
- `GET /api/task-competency-links/:id`
- `POST /api/task-competency-links`
- `DELETE /api/task-competency-links/:id`

#### routes/taskCompetencyLinks.js
const express = require('express');
const router = express.Router();
const linksController = require('../controllers/taskCompetencyLinksController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['hq','command','trainer']), linksController.getAllLinks);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), linksController.getLinkById);
router.post('/', authenticate, authorize(['hq']), linksController.createLink);
router.delete('/:id', authenticate, authorize(['hq']), linksController.deleteLink);

module.exports = router;

#### controller/taskCompetencyLinksController.js
const db = require('../db');

exports.getAllLinks = async (req, res) => {
  const { competency, task } = req.query;
  console.log('GET /api/task-competency-links', { competency, task });
  
  let sql = 'SELECT * FROM task_competency_links';
  const params = [];
  const clauses = [];

  if (competency) {
    params.push(competency);
    clauses.push(`competency_id = $${params.length}`);
  }
  if (task) {
    params.push(task);
    clauses.push(`task_id = $${params.length}`);
  }
  if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
  sql += ' ORDER BY competency_id, task_id';

  try {
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching links:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getLinkById = async (req, res) => {
  const { id } = req.params;
  console.log(`GET /api/task-competency-links/${id}`);
  try {
    const result = await db.query(
      'SELECT * FROM task_competency_links WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching link:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createLink = async (req, res) => {
  console.log('POST /api/task-competency-links', req.body);
  const { task_id, competency_id, certification_phase, recurrence_type } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO task_competency_links
         (task_id, competency_id, certification_phase, recurrence_type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [task_id, competency_id, certification_phase, recurrence_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating link:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteLink = async (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /api/task-competency-links/${id}`);
  try {
    const result = await db.query(
      'DELETE FROM task_competency_links WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    res.json({ message: 'Link deleted' });
  } catch (err) {
    console.error('Error deleting link:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

### **Training Events**
- CRUD implemented
- Attendees:
  - `GET /api/training-events/:id/attendees`
  - `POST /api/training-events/:id/attendees` (bulk supported)
  - `DELETE /api/training-events/:id/attendees/:attendeeId`

#### routes/trainingEvents.js
const express = require('express');
const router = express.Router();
const trainingEventsController = require('../controllers/trainingEventsController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['hq','command','trainer']), trainingEventsController.getAllEvents);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), trainingEventsController.getEventById);
router.post('/', authenticate, authorize(['hq','command']), trainingEventsController.createEvent);
router.put('/:id', authenticate, authorize(['hq','command']), trainingEventsController.updateEvent);
router.delete('/:id', authenticate, authorize(['hq']), trainingEventsController.deleteEvent);

module.exports = router;

#### routes/trainingEventAttendees.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/trainingEventAttendeesController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['hq','command']), controller.getAllAttendees);
router.get('/:id', authenticate, authorize(['hq','command']), controller.getAttendeeById);
router.post('/', authenticate, authorize(['hq','command']), controller.addAttendee);
router.put('/:id', authenticate, authorize(['hq','command']), controller.updateAttendee);
router.delete('/:id', authenticate, authorize(['hq','command']), controller.deleteAttendee);

module.exports = router;

#### controller/trainingEventsController.js
const db = require('../db');

exports.getAllEvents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM training_events ORDER BY date DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching training events:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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

#### controllers/trainingEventAttendeesController.js
const db = require('../db');

exports.getAllAttendees = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM training_event_attendees');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching attendees:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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

### **Task Logs**
- `GET /api/task-logs` (filters supported)
- `POST /api/task-logs` (bulk supported)
- `DELETE /api/task-logs/:id`

#### routes/taskLogs.js
const express = require('express');
const router = express.Router();
const taskLogsController = require('../controllers/taskLogsController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['hq','command','trainer']), taskLogsController.getAllLogs);
router.post('/', authenticate, authorize(['hq','command','trainer']), taskLogsController.createLogs);
router.delete('/:id', authenticate, authorize(['hq','command']), taskLogsController.deleteLog);

module.exports = router;

#### controllers/taskLogsController.js
const db = require('../db');

exports.getAllLogs = async (req, res) => {
  try {
    const { member_id, task_id, competency_id, start_date, end_date } = req.query;
    let sql = `
      SELECT tl.*, m.first_name AS member_first_name, m.last_name AS member_last_name,
             t.code AS task_code, t.title AS task_title
        FROM task_logs tl
        JOIN members m ON tl.member_id = m.id
        JOIN tasks t ON tl.task_id = t.id
    `;
    const conditions = [];
    const params = [];

    if (member_id) {
      params.push(member_id);
      conditions.push(`tl.member_id = $${params.length}`);
    }
    if (task_id) {
      params.push(task_id);
      conditions.push(`tl.task_id = $${params.length}`);
    }
    if (start_date) {
      params.push(start_date);
      conditions.push(`tl.date_completed >= $${params.length}`);
    }
    if (end_date) {
      params.push(end_date);
      conditions.push(`tl.date_completed <= $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY tl.date_completed DESC';

    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching task logs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createLogs = async (req, res) => {
  const input = req.body;

  // Normalize input to array
  const logs = Array.isArray(input) ? input : [input];

  for (const log of logs) {
    if (!log.task_id || !log.member_id || !log.date_completed || !log.instructor_id) {
      return res.status(400).json({ error: 'Missing required fields in one or more objects' });
    }
  }

  try {
    const values = logs
      .map((l, idx) => `($${idx * 4 + 1}, $${idx * 4 + 2}, $${idx * 4 + 3}, $${idx * 4 + 4})`)
      .join(', ');

    const flatValues = logs.flatMap(l => [
      l.task_id,
      l.member_id,
      l.date_completed,
      l.instructor_id
    ]);

    const query = `
      INSERT INTO task_logs (task_id, member_id, date_completed, instructor_id)
      VALUES ${values}
      RETURNING *;
    `;

    const result = await db.query(query, flatValues);
    res.status(201).json(result.rows);
  } catch (err) {
    console.error('Error creating task logs:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteLog = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM task_logs WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.json({ message: 'Task log deleted successfully' });
  } catch (err) {
    console.error('Error deleting task log:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

### **Certifications**
- Basic CRUD implemented
- Validation logic added for required tasks
- Role-based access and audit logging planned but pending JWT integration

#### routes/certifications.js
const express = require('express');
const router = express.Router();
const certificationsController = require('../controllers/certificationsController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['hq','command','trainer']), certificationsController.getAllCertifications);
router.get('/:id', authenticate, authorize(['hq','command','trainer']), certificationsController.getCertificationById);
router.post('/', authenticate, authorize(['hq','command']), certificationsController.createCertification);
router.delete('/:id', authenticate, authorize(['hq']), certificationsController.deleteCertification);

module.exports = router;

#### controllers/certificationsController.js
const db = require('../db');

exports.getAllCertifications = async (req, res) => {
  try {
    const { member_id, competency_id } = req.query;
    let sql = `
      SELECT c.*, m.first_name AS member_first, m.last_name AS member_last,
             comp.title AS competency_title
        FROM certifications c
        JOIN members m ON c.member_id = m.id
        JOIN competencies comp ON c.competency_id = comp.id
    `;
    const params = [];
    const conditions = [];

    if (member_id) {
      params.push(member_id);
      conditions.push(`c.member_id = $${params.length}`);
    }
    if (competency_id) {
      params.push(competency_id);
      conditions.push(`c.competency_id = $${params.length}`);
    }

    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY date_certified DESC';

    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching certifications:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCertificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM certifications WHERE id = $1', [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Certification not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching certification:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createCertification = async (req, res) => {
  const { member_id, competency_id, certified_by, date_certified } = req.body;

  try {
    const requiredTasks = await db.query(
      `SELECT task_id FROM task_competency_links
        WHERE competency_id = $1 AND certification_phase = 'initial'`,
      [competency_id]
    );

    if (!requiredTasks.rows.length) {
      return res.status(400).json({ error: 'No initial-phase tasks found for this competency' });
    }

    const taskIds = requiredTasks.rows.map(row => row.task_id);

    const completedTasks = await db.query(
      `SELECT DISTINCT task_id FROM task_logs
        WHERE member_id = $1 AND task_id = ANY($2::int[])`,
      [member_id, taskIds]
    );

    if (completedTasks.rows.length < taskIds.length) {
      return res.status(400).json({ 
        error: 'Member has not completed all required tasks for this competency',
        details: {
          required_tasks: taskIds,
          completed_tasks: completedTasks.rows.map(r => r.task_id)
        }
      });
    }

    const result = await db.query(
      `INSERT INTO certifications (member_id, competency_id, certified_by, date_certified)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [member_id, competency_id, certified_by, date_certified || new Date()]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating certification:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteCertification = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM certifications WHERE id = $1 RETURNING *', [id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Certification not found' });
    res.json({ message: 'Certification removed successfully' });
  } catch (err) {
    console.error('Error deleting certification:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

### **JWT Auth**
- Route configured
- Controller missing (07/15/2025)
- Middleware configured

#### routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // your PostgreSQL pool
require('dotenv').config();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userResult.rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

#### middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verify Token
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"
    if (!token) return res.status(401).json({ message: 'Access token required' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user; // {id, role}
        next();
    });
}

// Role-based Authorization
function authorize(roles = []) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}

module.exports = { authenticate, authorize };

### **Current server.js (07/15/2025)**
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

---

## Features Implemented
- Bulk inserts for attendees and task logs
- Validation for required tasks in certifications
- Prepared audit logging (structure ready)
- Modularized controller & route architecture

---

## Next Steps (Iteration Mode)
### **1. Implement Audit Logging**
- Create a helper function `logAction(userId, action, targetTable, targetId, changeData)`.
- Capture these actions:
  - CREATE, UPDATE, DELETE in all protected routes.
- Insert into `audit_log` table:
  - `user_id`, `action`, `target_table`, `target_id`, `change_data` (JSON), `timestamp`.

### **2. Reports API**
- Unit readiness metrics (certification ratios).
- Member training history.
- Export to PDF (future enhancement).

### **3. UI/UX Integration**
- After backend security + logging are done, begin frontend planning.

---

## Iteration Mode Guidelines
- Work in focused feature sprints (JWT > Certification Rule-Based Access Control > Reports > etc.).
- Keep SOP updated.
- Reset context every 20 messages by starting a new thread with this file.
- Once feature sprint is completed, suggest closing thread.
- If asked about additional unique features, suggest unique thread.