import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { HttpError } from '../utils/HttpError.js';

export const SESSION_COOKIE = 'pf_session';

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
    path: '/',
    maxAge: env.sessionHours * 60 * 60 * 1000,
  };
}

export function signSessionToken(admin) {
  return jwt.sign({ sub: admin.id, v: admin.tokenVersion }, env.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: env.sessionHours * 60 * 60,
  });
}

/** Returns the admin for a valid session token, or null. Never throws. */
export async function adminFromToken(token) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
    const admin = await Admin.findById(payload.sub);
    return admin && admin.tokenVersion === payload.v ? admin : null;
  } catch {
    return null;
  }
}

/** Server-side authorization guard for every admin-only endpoint. */
export async function requireAuth(req, _res, next) {
  const admin = await adminFromToken(req.cookies?.[SESSION_COOKIE]);
  if (!admin) throw new HttpError(401, 'Your session has expired. Please log in again.');
  req.admin = admin;
  next();
}
