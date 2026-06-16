// server/src/middleware/mongoSanitize.js
// Custom MongoDB sanitizer — replaces express-mongo-sanitize
// (which crashes on Express 5 because req.query is a getter-only property)

const PROHIBITED_PATTERN = /[$.]/;

/**
 * Recursively remove any keys containing '$' or '.' from an object/array.
 * Mutates the object in place.
 */
const deepSanitize = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = deepSanitize(obj[i]);
    }
    return obj;
  }

  for (const key of Object.keys(obj)) {
    if (PROHIBITED_PATTERN.test(key)) {
      // Strip prohibited key (MongoDB operator injection)
      delete obj[key];
    } else {
      obj[key] = deepSanitize(obj[key]);
    }
  }
  return obj;
};

/**
 * Replace req[propName] with a sanitized copy.
 * Uses Object.defineProperty so it works even when the property
 * is a getter-only accessor (Express 5 req.query).
 */
const replaceSafe = (req, propName) => {
  const original = req[propName];
  if (!original || typeof original !== 'object') return;

  // Clone first so we never mutate the original parsed reference
  const cloned = JSON.parse(JSON.stringify(original));
  const sanitized = deepSanitize(cloned);

  Object.defineProperty(req, propName, {
    value: sanitized,
    writable: true,
    configurable: true,
    enumerable: true,
  });
};

const mongoSanitize = (req, _res, next) => {
  try {
    replaceSafe(req, 'body');
    replaceSafe(req, 'query');
    replaceSafe(req, 'params');
    next();
  } catch (err) {
    next(err);
  }
};

export default mongoSanitize;