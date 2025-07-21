const db = require('../db');
const { successResponse, errorResponse } = require('../utils/response');

// 1. Unit Readiness
exports.getUnitReadiness = async (req, res) => {
  try {
    const { competency_id, unit_id } = req.query;

    const sql = `
      SELECT u.id AS unit_id, u.name AS unit_name,
             COUNT(m.id) AS total_members,
             COUNT(c.id) FILTER (WHERE c.status = 'active') AS certified_members,
             ROUND(COUNT(c.id) FILTER (WHERE c.status = 'active') * 100.0 / NULLIF(COUNT(m.id), 0), 2) AS readiness_percentage
      FROM units u
      JOIN members m ON m.unit_id = u.id
      LEFT JOIN certifications c ON c.member_id = m.id
          AND ($1::int IS NULL OR c.competency_id = $1::int)
      WHERE ($2::int IS NULL OR u.id = $2::int)
      GROUP BY u.id, u.name
      ORDER BY readiness_percentage DESC;
    `;

    const params = [
      competency_id ? parseInt(competency_id) : null,
      unit_id ? parseInt(unit_id) : null
    ];

    const result = await db.query(sql, params);

    return successResponse(res, { count: result.rowCount, units: result.rows });
  } catch (err) {
    console.error('Error fetching unit readiness report:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// ✅ 2. Competency Summary
exports.getCompetencySummary = async (req, res) => {
  try {
    const { competency_id } = req.query;

    if (!competency_id) {
      return errorResponse(res, 'competency_id is required', 400);
    }

    const sql = `
      SELECT c.status, COUNT(*) AS count
      FROM certifications c
      WHERE c.competency_id = $1::int
      GROUP BY c.status;
    `;

    const result = await db.query(sql, [parseInt(competency_id)]);
    return successResponse(res, { competency_id: parseInt(competency_id), summary: result.rows });
  } catch (err) {
    console.error('Error fetching competency summary:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// ✅ 3. Training History
exports.getTrainingHistory = async (req, res) => {
  try {
    const { member_id, unit_id, start_date, end_date } = req.query;

    const sql = `
      SELECT tl.id, tl.task_id, t.title AS task_title,
             tl.member_id, m.first_name || ' ' || m.last_name AS member_name,
             tl.completion_date
      FROM task_logs tl
      JOIN tasks t ON t.id = tl.task_id
      JOIN members m ON m.id = tl.member_id
      WHERE ($1::int IS NULL OR tl.member_id = $1::int)
        AND ($2::int IS NULL OR m.unit_id = $2::int)
        AND ($3::date IS NULL OR tl.completion_date >= $3::date)
        AND ($4::date IS NULL OR tl.completion_date <= $4::date)
      ORDER BY tl.completion_date DESC;
    `;

    const params = [
      member_id ? parseInt(member_id) : null,
      unit_id ? parseInt(unit_id) : null,
      start_date || null,
      end_date || null
    ];

    const result = await db.query(sql, params);
    return successResponse(res, { count: result.rowCount, logs: result.rows });
  } catch (err) {
    console.error('Error fetching training history:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// ✅ 4. Upcoming Training
exports.getUpcomingTraining = async (req, res) => {
  try {
    const { unit_id } = req.query;

    const sql = `
      SELECT te.id, te.title, te.date, te.start_time, te.end_time,
             m.first_name || ' ' || m.last_name AS instructor_name
      FROM training_events te
      JOIN members m ON m.id = te.instructor_id
      WHERE te.date >= CURRENT_DATE
        AND ($1::int IS NULL OR m.unit_id = $1::int)
      ORDER BY te.date ASC;
    `;

    const result = await db.query(sql, [unit_id ? parseInt(unit_id) : null]);
    return successResponse(res, { count: result.rowCount, events: result.rows });
  } catch (err) {
    console.error('Error fetching upcoming training:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// ✅ 5. Task Compliance (Nuanced)
exports.getTaskCompliance = async (req, res) => {
  try {
    // TODO: Add SQL aggregation logic
    return successResponse(res, { message: 'Task compliance report coming soon' });
  } catch (err) {
    console.error('Error fetching task compliance report:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};

// ✅ 6. Certification Risk (Expiring Soon)
exports.getCertificationRisk = async (req, res) => {
  try {
    // TODO: Add SQL aggregation logic
    return successResponse(res, { message: 'Certification risk report coming soon' });
  } catch (err) {
    console.error('Error fetching certification risk report:', err);
    return errorResponse(res, 'Internal server error', 500);
  }
};
