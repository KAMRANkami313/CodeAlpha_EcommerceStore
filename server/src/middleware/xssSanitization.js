// server/src/middleware/xssSanitization.js
import xss from 'xss';

/**
 * XSS Sanitization Middleware
 *
 * Strips ALL HTML tags from incoming request data (body, query, params).
 *
 * ⚠️ IMPORTANT: This middleware uses an aggressive whitelist (empty whiteList)
 * that removes ALL HTML tags from user input. This means:
 *   - If a user types "I love <script> discussions", the output becomes "I love  discussions"
 *   - The `stripIgnoreTagBody: ['script']` option removes content BETWEEN <script> tags entirely
 *   - This is intentional for security — never render user input as raw HTML on the frontend
 *
 * If you need to support rich text input in the future:
 *   1. Use a rich-text editor (e.g., TipTap, Quill) that stores structured data, not raw HTML
 *   2. Sanitize on output (rendering), not just on input
 *   3. Never use dangerouslySetInnerHTML with user-generated content
 */
const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return xss(value, {
      whiteList: {},          // strip ALL HTML tags — no HTML is allowed in user input
      stripIgnoreTag: true,   // strip tags that aren't in the whitelist
      stripIgnoreTagBody: ['script'], // remove content between <script> tags entirely
    });
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value)) {
      out[key] = sanitizeValue(value[key]);
    }
    return out;
  }
  return value;
};

/**
 * Replace req[propName] with a XSS-sanitized copy.
 * Uses Object.defineProperty so it works even when the property
 * is a getter-only accessor (Express 5 req.query).
 */
const replaceSafe = (req, propName) => {
  const original = req[propName];
  if (!original || typeof original !== 'object') return;

  const sanitized = sanitizeValue(original);

  Object.defineProperty(req, propName, {
    value: sanitized,
    writable: true,
    configurable: true,
    enumerable: true,
  });
};

const xssSanitization = (req, _res, next) => {
  try {
    replaceSafe(req, 'body');
    replaceSafe(req, 'query');
    replaceSafe(req, 'params');
    next();
  } catch (err) {
    next(err);
  }
};

export default xssSanitization;
