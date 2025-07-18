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

## **Authentication**
- `POST /api/auth/login` → Returns JWT token and user info.

---

## **Members**
- `GET /api/members` → Retrieve all members.
- `GET /api/members/:id` → Retrieve a member by ID.
- `POST /api/members` → Create a new member.
- `PUT /api/members/:id` → Update member details.
- `DELETE /api/members/:id` → Delete a member.

---

## **Tasks**
- `GET /api/tasks` → Retrieve all tasks.
- `GET /api/tasks/:id` → Retrieve a task by ID.
- `POST /api/tasks` → Create a new task.
- `PUT /api/tasks/:id` → Update a task.
- `DELETE /api/tasks/:id` → Delete a task.

---

## **Competencies**
- `GET /api/competencies` → Retrieve all competencies.
- `GET /api/competencies/:id` → Retrieve a competency by ID.
- `POST /api/competencies` → Create a new competency.
- `PUT /api/competencies/:id` → Update a competency.
- `DELETE /api/competencies/:id` → Delete a competency.

---

## **Certifications**
- `GET /api/certifications` → Retrieve all certifications.
- `GET /api/certifications/:id` → Retrieve a certification by ID.
- `POST /api/certifications` → Create a new certification (with validation logic for required tasks).
- `PATCH /api/certifications/:id` → Update certification status (`active`, `expired`, `revoked`).
- `DELETE /api/certifications/:id` → Delete a certification.

---

## **Task-Competency Links**
- `GET /api/task-competency-links` → Retrieve all links (supports filters: `competency`, `task`).
- `GET /api/task-competency-links/:id` → Retrieve a specific link.
- `POST /api/task-competency-links` → Create a new link.
- `DELETE /api/task-competency-links/:id` → Delete a link.

---

## **Task Logs**
- `GET /api/task-logs` → Retrieve all task logs (supports filters: `member_id`, `task_id`, `start_date`, `end_date`).
- `POST /api/task-logs` → Create one or multiple task logs in bulk.
- `DELETE /api/task-logs/:id` → Delete a task log.

---

## **Training Events**
- `GET /api/training-events` → Retrieve all training events.
- `GET /api/training-events/:id` → Retrieve a training event by ID.
- `POST /api/training-events` → Create a new training event.
- `PUT /api/training-events/:id` → Update a training event.
- `DELETE /api/training-events/:id` → Delete a training event.

---

## **Training Event Attendees**
- `GET /api/training-event-attendees` → Retrieve all attendees.
- `GET /api/training-event-attendees/:id` → Retrieve an attendee by ID.
- `POST /api/training-event-attendees` → Add one or multiple attendees.
- `PUT /api/training-event-attendees/:id` → Update an attendee record.
- `DELETE /api/training-event-attendees/:id` → Delete an attendee.

## Features Implemented
- Bulk inserts for attendees and task logs
- Validation for required tasks in certifications
- Prepared audit logging (structure ready)
- Modularized controller & route architecture

---

## Next Steps (Pre-Reports Cleanup)

## ✅ Immediate Tasks
1. **Finalize Validation Across All Controllers**
   - Ensure every `POST` and `PUT` route validates required fields consistently.
   - Confirm proper HTTP status codes (`201` for creation, `200` for updates/deletes, `404` for not found).

2. **Standardize API Response Structure**
   - All responses use:
     - Success:
       ```json
       { "success": true, "data": { ... } }
       ```
     - Error:
       ```json
       { "success": false, "error": "Descriptive error message" }
       ```

3. **Update SOP.md**
   - Add finalized API standards, status code usage, and validation rules for future developers.

---

## ✅ Next Development Sprint
- **Postman Collection & Automated Testing**
  - Build a complete Postman collection with positive and negative test cases.
  - Implement environment variables for `{{base_url}}` and `{{token}}`.

- **Audit Logging**
  - Implement `withAudit` middleware to capture:
    - `user_id`, `action`, `target_table`, `target_id`, `change_data`, `timestamp`.

- **Performance Optimization**
  - Add DB indexes for high-usage columns:
    ```sql
    CREATE INDEX idx_certifications_status ON certifications(status);
    CREATE INDEX idx_task_logs_member_id ON task_logs(member_id);
    CREATE INDEX idx_training_events_date ON training_events(date);
    ```

---

## ✅ Future Enhancements
- **Reports API**
  - Unit readiness metrics (certification status by unit).
  - Member training history.
  - Competency completion dashboards.

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