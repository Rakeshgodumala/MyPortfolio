import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const sameSite = (process.env.COOKIE_SAMESITE || 'lax').toLowerCase();

export const env = {
  nodeEnv,
  isProd,
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  sessionHours: Number(process.env.SESSION_HOURS) || 2,
  clientOrigins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean),
  cookieSameSite: ['lax', 'strict', 'none'].includes(sameSite) ? sameSite : 'lax',
  // Browsers reject SameSite=None cookies unless they are also Secure.
  cookieSecure: isProd || sameSite === 'none' || process.env.COOKIE_SECURE === 'true',
  trustProxy: Number(process.env.TRUST_PROXY) || 0,
  cloudinaryUrl: process.env.CLOUDINARY_URL || '',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  contactToEmail: process.env.CONTACT_TO_EMAIL || '',
  contactFromEmail: process.env.CONTACT_FROM_EMAIL || '',
};

/** Fails fast at server start-up when security-critical settings are missing. */
export function assertServerEnv() {
  const problems = [];
  if (!env.mongoUri) problems.push('MONGODB_URI is not set.');
  if (env.jwtSecret.length < 32) {
    problems.push(
      'JWT_SECRET must be at least 32 characters. Generate one with: ' +
        `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`,
    );
  }
  if (env.isProd && env.clientOrigins.some((origin) => origin.startsWith('http://localhost'))) {
    problems.push('CLIENT_ORIGIN still points to localhost in production.');
  }
  if (problems.length) {
    throw new Error(`Invalid backend configuration:\n - ${problems.join('\n - ')}`);
  }
}
