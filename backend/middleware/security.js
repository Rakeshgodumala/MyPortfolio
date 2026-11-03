import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function isAllowedOrigin(origin) {
  return env.clientOrigins.includes(origin);
}

/**
 * CSRF defence for cookie-authenticated requests. State-changing requests must:
 *  - carry the custom X-Requested-With header (HTML forms and simple cross-site requests cannot set it,
 *    and CORS blocks the preflight for origins that are not allow-listed), and
 *  - come from an allow-listed Origin when the browser sends one.
 */
export function verifyRequestOrigin(req, _res, next) {
  if (SAFE_METHODS.has(req.method)) return next();
  const origin = req.get('origin');
  if (origin && !isAllowedOrigin(origin)) {
    throw new HttpError(403, 'Request origin is not allowed.');
  }
  if (req.get('x-requested-with') !== 'XMLHttpRequest') {
    throw new HttpError(403, 'Missing request header.');
  }
  next();
}

/** Removes keys such as "$where" or "a.b" from request bodies to prevent MongoDB operator injection. */
export function stripMongoOperators(req, _res, next) {
  const scrub = (value) => {
    if (Array.isArray(value)) return value.map(scrub);
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value)
          .filter(([key]) => !key.startsWith('$') && !key.includes('.'))
          .map(([key, inner]) => [key, scrub(inner)]),
      );
    }
    return value;
  };
  if (req.body && typeof req.body === 'object') req.body = scrub(req.body);
  next();
}

const limiter = (options) =>
  rateLimit({
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_req, res, _next, opts) => res.status(opts.statusCode).json({ message: opts.message }),
    ...options,
  });

export const apiLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: 'Too many requests. Please slow down and try again shortly.',
});

export const loginLimiter = limiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts. Please wait 15 minutes and try again.',
});

export const contactLimiter = limiter({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: 'You have sent several messages recently. Please try again later or email me directly.',
});
