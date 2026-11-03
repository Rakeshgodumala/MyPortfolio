import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { SESSION_COOKIE, adminFromToken, sessionCookieOptions, signSessionToken } from '../middleware/auth.js';
import { HttpError } from '../utils/HttpError.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
// Compared against when the email is unknown, so response time does not reveal which emails exist.
const DUMMY_HASH = bcrypt.hashSync('timing-equaliser-not-a-real-password', 12);

export async function login(req, res) {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!email || !password) throw new HttpError(400, 'Email and password are required.');
  if (email.length > 120 || password.length > 200) throw new HttpError(401, 'Invalid email or password.');

  const admin = await Admin.findOne({ email }).select('+passwordHash');

  if (admin?.lockUntil && admin.lockUntil > new Date()) {
    const minutes = Math.ceil((admin.lockUntil - Date.now()) / 60000);
    throw new HttpError(429, `Too many failed attempts. Try again in ${minutes} minute(s).`);
  }

  const passwordMatches = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || !passwordMatches) {
    if (admin) {
      admin.failedLoginAttempts += 1;
      if (admin.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        admin.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
        admin.failedLoginAttempts = 0;
      }
      await admin.save();
    }
    throw new HttpError(401, 'Invalid email or password.');
  }

  admin.failedLoginAttempts = 0;
  admin.lockUntil = undefined;
  admin.lastLoginAt = new Date();
  await admin.save();

  res.cookie(SESSION_COOKIE, signSessionToken(admin), sessionCookieOptions());
  res.json({ admin: { email: admin.email } });
}

export async function me(req, res) {
  res.json({ admin: { email: req.admin.email } });
}

export async function logout(req, res) {
  const admin = await adminFromToken(req.cookies?.[SESSION_COOKIE]);
  if (admin) {
    // Revokes this and any other outstanding session tokens, not just the browser cookie.
    admin.tokenVersion += 1;
    await admin.save();
  }
  const { maxAge, ...clearOptions } = sessionCookieOptions();
  res.clearCookie(SESSION_COOKIE, clearOptions);
  res.status(204).end();
}
