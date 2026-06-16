// server/src/middleware/xssSanitization.js
import xss from 'xss';

/**
 * Recursively XSS-sanitize strings inside any value.
 * Returns a NEW value — does not mutate input.
 */
const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return xss(value, {
      whiteList: {},          // strip ALL HTML tags
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script'],
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