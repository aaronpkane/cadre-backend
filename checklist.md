
# ✅ Cadre Backend Development Checklist

## 1. Environment & Core Setup
- [x] Node.js installed and working
- [x] PostgreSQL installed and accessible
- [x] Project initialized with `npm init`
- [x] Core libraries installed: `express`, `pg`, `dotenv`, `cors`, `bcrypt`, `jsonwebtoken`
- [x] `.env` configured for environment variables (DB credentials, JWT secret, PORT)
- [x] `server.js` created and confirmed running on `localhost:4000`

## 2. Folder Structure
- [x] `/controllers` – Business logic for each resource (e.g., `membersController.js`)
- [x] `/routes` – Route definitions per resource (e.g., `members.js`)
- [x] `/models` *(optional)* – Abstracted DB queries
- [x] `/db.js` – Database connection pool setup
- [x] `/middleware` – Auth and error handling
- [x] `/seed.js` – Seeding script with ordered inserts
- [x] `/utils` *(optional)* – Helper functions

## 3. Database (PostgreSQL)
- [x] `cadre_db` database created
- [x] Tables created:
  - [x] `roles`
  - [x] `users`
  - [x] `units`
  - [x] `members`
  - [x] `competencies`
  - [x] `tasks`
  - [x] `task_competency_links`
  - [x] `assignments`
  - [x] `certifications`
  - [x] `task_logs`
  - [x] `audit_log`
- [x] `admin` superuser with full access (temporary)
- [ ] Ownership will be shifted from `postgres` to `admin` before deployment

## 4. Seed Data
- [x] Seed script defined in `seed.js`
- [x] Data cleared before insert (`DELETE` or `TRUNCATE`)
- [x] Members seeded
- [x] Tasks and competencies seeded
- [x] `task_competency_links` seeded with:
  - [x] `initial` and `recurring` phase rows when needed
- [x] Foreign keys respected

## 5. Express Routing & Controllers
- [x] Modular routing (`/api/members`, `/api/tasks`, etc.)
- [x] Controllers defined for all endpoints
- [x] Routes support:
  - [x] GET all
  - [x] GET by ID
  - [x] POST
  - [ ] PUT/PATCH
  - [ ] DELETE

## 6. Authentication & Authorization
- [ ] JWT-based login
- [ ] Role-based access control middleware
- [ ] Login and registration routes
- [ ] Hashed passwords with `bcrypt`

## 7. Core Business Logic (MVP)
- [ ] Assignments: POST to assign competency to member
- [ ] Certifications: POST to certify member with maturity judgment
- [ ] Task Logging: POST task logs with dates and instructors
- [ ] Readiness Calculations:
  - [ ] Certification % per competency
  - [ ] Overall unit readiness score
- [ ] Currency evaluation (green/amber/red status)
- [ ] Reporting endpoints

## 8. Admin & Maintenance
- [x] `audit_log` table created
- [ ] Audit trail populated on actions (assignments, certs, logs)
- [ ] Billet-based auto-assignment (stub or post-MVP)
- [ ] Maintenance tools (e.g. bulk updates, clear logs)

## 9. Testing
- [ ] Manual testing via Postman/Insomnia
- [ ] Seeded data verified via GET endpoints
- [ ] Simulated full flow: assign → log → certify → audit

## 10. Shipping Prep
- [ ] Remove `SUPERUSER` from `admin`
- [ ] Reassign ownership of tables/sequences to `admin`
- [ ] Add `.env.example`
- [ ] `README.md` with:
  - [ ] Setup instructions
  - [ ] Seeding instructions
  - [ ] API overview
- [ ] Production-ready PostgreSQL setup (if applicable)
