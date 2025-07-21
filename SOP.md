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

## Database Schema Updates
### ✅ task_logs
- Added `instructor_id INT REFERENCES members(id)`
- Enforced `certification_phase TEXT NOT NULL` (values: `initial`, `recurrent`)
- Columns now:
  ```sql
  id | task_id | member_id | completed_by | completion_date | instructor_id | certification_phase | notes
  ```
---

### ✅ certifications
- Correct field name: `certification_date DATE NOT NULL`
- Status allowed: `active | expired | revoked`
- Phase allowed: `initial | recurrent`

---

## Key Integrity Fixes
- All controllers and routes now **match schema field names**.
- Validation enforces:
  - Task Logs: `task_id`, `member_id`, `completion_date`, `instructor_id`, `certification_phase`
  - Certifications: `member_id`, `competency_id`, `certification_phase`
- `withAudit()` updated to log:
  - Correct `target_id` (supports single and bulk inserts)
  - Original request body
  - User context from JWT

---

## Performance Indexes
Added for critical queries:
```sql
CREATE INDEX idx_certifications_status ON certifications(status);
CREATE INDEX idx_certifications_competency ON certifications(competency_id);
CREATE INDEX idx_task_logs_member_id ON task_logs(member_id);
CREATE INDEX idx_task_logs_completion_date ON task_logs(completion_date);
CREATE INDEX idx_task_logs_instructor_id ON task_logs(instructor_id);
CREATE INDEX idx_training_events_date ON training_events(date);
CREATE INDEX idx_members_unit_id ON members(unit_id);
```

---

### **users**
```bash
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
```

### **roles**
```bash
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
```

### **units**
```bash
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
```

### **members**
```bash
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
```

### **assignments**
```bash
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
```

### **competencies**
```bash
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
```

### **tasks**
```bash
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
```

### **task_competency_links**
```bash
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
```

### **certifications**
```bash
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
```

### **training_events**
```bash
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
```

### **training_event_attendees**
```bash
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
```

### **task_logs**
```bash
                                   Table "public.task_logs"
       Column        |  Type   | Collation | Nullable |                Default
---------------------+---------+-----------+----------+---------------------------------------
 id                  | integer |           | not null | nextval('task_logs_id_seq'::regclass)
 task_id             | integer |           | not null |
 member_id           | integer |           | not null |
 completed_by        | integer |           |          |
 completion_date     | date    |           | not null |
 certification_phase | text    |           | not null |
 instructor_id       | integer |           | not null |
 notes               | text    |           |          |
Indexes:
    "task_logs_pkey" PRIMARY KEY, btree (id)
    "idx_task_logs_completion_date" btree (completion_date)
    "idx_task_logs_instructor_id" btree (instructor_id)
    "idx_task_logs_member_id" btree (member_id)
Check constraints:
    "task_logs_certification_phase_check" CHECK (certification_phase = ANY (ARRAY['initial'::text, 'recurrent'::text]))
Foreign-key constraints:
    "task_logs_completed_by_fkey" FOREIGN KEY (completed_by) REFERENCES users(id)
    "task_logs_instructor_id_fkey" FOREIGN KEY (instructor_id) REFERENCES members(id)
    "task_logs_member_id_fkey" FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
    "task_logs_task_id_fkey" FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
Referenced by:
    TABLE "task_completions" CONSTRAINT "task_completions_most_recent_log_id_fkey" FOREIGN KEY (most_recent_log_id) REFERENCES task_logs(id)
```

### **audit_log**
```bash
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
```

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

## API Routes Completed

### **Reports**
- `GET /api/reports/unit-readiness` → Unit readiness by certification status.
- `GET /api/reports/competency-summary` → Summary counts for a specific competency.
- `GET /api/reports/training-history` → Historical task logs by member/unit/date range.
- `GET /api/reports/upcoming-training` → Upcoming training events by unit/date.
- `GET /api/reports/task-compliance` → Compliance status for recurrent tasks (future enhancement).
- `GET /api/reports/certification-risk` → Certifications expiring soon (future enhancement).

#### SQL Reference for Reports API

##### 1. Unit Readiness
```sql
SELECT u.id AS unit_id, u.name AS unit_name,
       COUNT(m.id) AS total_members,
       COUNT(c.id) FILTER (WHERE c.status = 'active') AS certified_members,
       ROUND(COUNT(c.id) FILTER (WHERE c.status = 'active') * 100.0 / NULLIF(COUNT(m.id), 0), 2) AS readiness_percentage
FROM units u
JOIN members m ON m.unit_id = u.id
LEFT JOIN certifications c ON c.member_id = m.id
    AND (c.competency_id = $1 OR $1 IS NULL)
WHERE (u.id = $2 OR $2 IS NULL)
GROUP BY u.id, u.name
ORDER BY readiness_percentage DESC;
```

Parameters: `$1` = competency_id (nullable), `$2` = unit_id (nullable)

##### 2. Competency Summary
```sql
SELECT c.status, COUNT(*) AS count
FROM certifications c
WHERE c.competency_id = $1
GROUP BY c.status;
```

Parameter: `$1` = competency_id

##### 3. Training History
```sql
SELECT tl.id, tl.task_id, t.title AS task_title,
       tl.member_id, m.first_name || ' ' || m.last_name AS member_name,
       tl.date_completed
FROM task_logs tl
JOIN tasks t ON t.id = tl.task_id
JOIN members m ON m.id = tl.member_id
WHERE ($1 IS NULL OR tl.member_id = $1)
  AND ($2 IS NULL OR m.unit_id = $2)
  AND ($3 IS NULL OR tl.date_completed >= $3)
  AND ($4 IS NULL OR tl.date_completed <= $4)
ORDER BY tl.date_completed DESC;
```

Parameters: `$1` = member_id, `$2` = unit_id, `$3` = start_date, `$4` = end_date

##### 4. Upcoming Training
```sql
SELECT te.id, te.title, te.date, te.start_time, te.end_time,
       m.first_name || ' ' || m.last_name AS instructor_name
FROM training_events te
JOIN members m ON m.id = te.instructor_id
WHERE te.date >= CURRENT_DATE
  AND ($1 IS NULL OR te.unit_id = $1)
ORDER BY te.date ASC;
```

Parameter: `$1` = unit_id (nullable)

---

### **Authentication**
- `POST /api/auth/login` → Returns JWT token and user info.

---

### **Members**
- `GET /api/members` → Retrieve all members.
- `GET /api/members/:id` → Retrieve a member by ID.
- `POST /api/members` → Create a new member.
- `PUT /api/members/:id` → Update member details.
- `DELETE /api/members/:id` → Delete a member.

---

### **Tasks**
- `GET /api/tasks` → Retrieve all tasks.
- `GET /api/tasks/:id` → Retrieve a task by ID.
- `POST /api/tasks` → Create a new task.
- `PUT /api/tasks/:id` → Update a task.
- `DELETE /api/tasks/:id` → Delete a task.

---

### **Competencies**
- `GET /api/competencies` → Retrieve all competencies.
- `GET /api/competencies/:id` → Retrieve a competency by ID.
- `POST /api/competencies` → Create a new competency.
- `PUT /api/competencies/:id` → Update a competency.
- `DELETE /api/competencies/:id` → Delete a competency.

---

### **Certifications**
- `GET /api/certifications` → Retrieve all certifications.
- `GET /api/certifications/:id` → Retrieve a certification by ID.
- `POST /api/certifications` → Create a new certification (with validation logic for required tasks).
- `PATCH /api/certifications/:id` → Update certification status (`active`, `expired`, `revoked`).
- `DELETE /api/certifications/:id` → Delete a certification.

---

### **Task-Competency Links**
- `GET /api/task-competency-links` → Retrieve all links (supports filters: `competency`, `task`).
- `GET /api/task-competency-links/:id` → Retrieve a specific link.
- `POST /api/task-competency-links` → Create a new link.
- `DELETE /api/task-competency-links/:id` → Delete a link.

---

### **Task Logs**
- `GET /api/task-logs` → Retrieve all task logs (supports filters: `member_id`, `task_id`, `start_date`, `end_date`).
- `POST /api/task-logs` → Create one or multiple task logs in bulk.
- `DELETE /api/task-logs/:id` → Delete a task log.

---

### **Training Events**
- `GET /api/training-events` → Retrieve all training events.
- `GET /api/training-events/:id` → Retrieve a training event by ID.
- `POST /api/training-events` → Create a new training event.
- `PUT /api/training-events/:id` → Update a training event.
- `DELETE /api/training-events/:id` → Delete a training event.

---

### **Training Event Attendees**
- `GET /api/training-event-attendees` → Retrieve all attendees.
- `GET /api/training-event-attendees/:id` → Retrieve an attendee by ID.
- `POST /api/training-event-attendees` → Add one or multiple attendees.
- `PUT /api/training-event-attendees/:id` → Update an attendee record.
- `DELETE /api/training-event-attendees/:id` → Delete an attendee.

---

## Audit Logging
- Middleware: `withAudit(tableName)`
- Logs:
  - `user_id`, `action`, `target_table`, `target_id`, `change_data (JSON)`, `timestamp`
- Applies to:
  - Members
  - Tasks
  - Task Logs
  - Competencies
  - Certifications
  - Training Events
  - Training Event Attendees

---

## Validation & Response Standards
- **Success:**
  ```json
  { "success": true, "data": { ... } }
  ```
- **Error:**
  ```json
  { "success": false, "error": "Descriptive error" }
  ```

---

## Postman Collection Structure
```sql
Cadre API
  ├── Auth
  │    └── Login (sets token)
  ├── Members
  │    ├── Get All
  │    ├── Get By ID
  │    ├── Create
  │    ├── Update
  │    └── Delete
  ├── Tasks
  │    ├── Get All
  │    ├── Get By ID
  │    ├── Create
  │    ├── Update
  │    └── Delete
  ├── Competencies
  │    ├── Get All
  │    ├── Get By ID
  │    ├── Create
  │    ├── Update
  │    └── Delete
  ├── Certifications
  │    ├── Get All
  │    ├── Get By ID
  │    ├── Create
  │    ├── Update Status
  │    └── Delete
  ├── Task-Competency Links
  │    ├── Get All
  │    ├── Get By ID
  │    ├── Create
  │    └── Delete
  ├── Task Logs
  │    ├── Get All
  │    ├── Create (Bulk Supported)
  │    └── Delete
  ├── Training Events
  │    ├── Get All
  │    ├── Get By ID
  │    ├── Create
  │    ├── Update
  │    └── Delete
  ├── Training Event Attendees
  │    ├── Get All
  │    ├── Get By ID
  │    ├── Add Attendee(s)
  │    ├── Update
  │    └── Delete
  └── Reports
       ├── Get Unit Readiness
       ├── Get Competency Summary
       ├── Get Training History
       ├── Get Upcoming Training
       ├── Get Task Compliance (future)
       └── Get Certification Risk (future)
```

---

## Features Implemented
- Bulk inserts for attendees and task logs
- Validation for required tasks in certifications
- Prepared audit logging (structure ready)
- Modularized controller & route architecture

---

## Next Steps (Reports Cleanup)

## ✅ Immediate Steps

- Freeze backend codebase.
- Begin **Frontend Development** (React or React + Tailwind suggested).

---

## ✅ Future Enhancements

- **UI/UX**
  - Build a modern frontend with secure authentication.
  - Integrate charts for readiness and training progress.

- **Role-Based Improvements**
  - Fine-tune RBAC for command vs HQ privileges.
  - Add audit visibility for compliance.

---

## Iteration Mode Guidelines
- Work in focused feature sprints (JWT > Certification Rule-Based Access Control > Reports > etc.).
- Keep SOP updated.
- Reset context every 20 messages by starting a new thread with this file.
- Once feature sprint is completed, suggest closing thread.
- If asked about additional unique features, suggest unique thread.
---
