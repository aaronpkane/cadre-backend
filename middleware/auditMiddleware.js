const { logAction } = require('../utils/auditLogger');

function withAudit(targetTable) {
  return async (req, res, next) => {
    const originalSend = res.send;

    res.send = async function (body) {
      originalSend.call(this, body);

      try {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const actionMap = { POST: 'CREATE', PUT: 'UPDATE', PATCH: 'UPDATE', DELETE: 'DELETE' };
          const action = actionMap[req.method];

          if (action) {
            const parsedBody = typeof body === 'string' ? JSON.parse(body) : body;
            const data = parsedBody?.data;
            let targetId = null;

            if (Array.isArray(data) && data.length > 0) {
              targetId = data[0]?.id;
            } else if (data && typeof data === 'object') {
              targetId = data.id || null;
            }

            await logAction(
              req.user?.id || null,
              action,
              targetTable,
              targetId,
              req.body,    // Original request body
              req.user || {}
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

