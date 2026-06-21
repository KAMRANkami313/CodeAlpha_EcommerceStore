/**
 * Simple audit logging middleware for admin actions.
 * Logs admin operations to console with structured format.
 * In production, you'd typically write to a database or external logging service.
 */

const auditLog = (actionType) => {
  return (req, res, next) => {
    // Capture the original end method to log after response is sent
    const originalEnd = res.end;

    res.end = function (...args) {
      // Only log successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const logEntry = {
          timestamp: new Date().toISOString(),
          action: actionType,
          admin: {
            id: req.user?._id?.toString(),
            email: req.user?.email,
            role: req.user?.role,
          },
          target: {
            method: req.method,
            path: req.originalUrl,
            params: req.params,
            body: req.method !== 'GET' ? sanitizeBody(req.body) : undefined,
          },
          result: res.statusCode,
        };

        console.log(`📋 AUDIT: ${JSON.stringify(logEntry)}`);
      }

      originalEnd.apply(res, args);
    };

    next();
  };
};

/**
 * Remove sensitive fields from request body before logging.
 */
const sanitizeBody = (body) => {
  if (!body || typeof body !== 'object') return body;
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'creditCard', 'cvv', 'token', 'secret'];
  for (const field of sensitiveFields) {
    if (sanitized[field]) sanitized[field] = '[REDACTED]';
  }
  return sanitized;
};

export default auditLog;
