const { logAction } = require('../utils/auditLogger');

function withAudit(targetTable) {
  return async (req, res, next) => {
    const originalSend = res.send;

    res.send = async function (body) {
      originalSend.call(this, body);

      try {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const actionMap = { POST: 'CREATE', PUT: 'UPDATE', DELETE: 'DELETE' };
          const action = actionMap[req.method];

          if (action) {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;

            await logAction(
              req.user?.id || null,
              action,
              targetTable,
              parsedBody?.id || null,
              req.body,           // Original request data
              req.user || {}      // Full JWT payload
            );
          }
        }
      } catch (err) {
        console.error('Audit log error:', err);
      }
    };

    next();
  };
}

module.exports = { withAudit };
