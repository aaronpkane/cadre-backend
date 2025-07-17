const db = require('../db');

async function logAction(userId, action, targetTable, targetId, changeData, userContext) {
  const logPayload = {
    request_body: changeData,
    user_context: userContext
  };

  const query = `
    INSERT INTO audit_log (user_id, action, target_table, target_id, change_data)
    VALUES ($1, $2, $3, $4, $5)
  `;
  await db.query(query, [userId, action, targetTable, targetId, logPayload]);
}

module.exports = { logAction };
