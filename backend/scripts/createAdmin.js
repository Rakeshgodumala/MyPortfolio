/**
 * Creates the portfolio administrator, or resets their password with --reset.
 *
 *   npm run create-admin              (interactive; the password is typed hidden)
 *   npm run create-admin -- --reset   (change the existing admin's password and sign out all sessions)
 *
 * For hosts without an interactive terminal, ADMIN_EMAIL and ADMIN_PASSWORD may be set for the
 * single run of this command. Never commit them to a file.
 */
import readline from 'node:readline';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';
import { EMAIL_PATTERN } from '../utils/validators.js';

const reset = process.argv.includes('--reset');

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      // Echo "*" instead of the typed characters.
      rl._writeToOutput = (text) => rl.output.write(text.startsWith(question) ? question : text.replace(/[^\r\n]/g, '*'));
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write('\n');
      resolve(answer);
    });
  });
}

function passwordProblems(password) {
  const problems = [];
  if (password.length < 10) problems.push('at least 10 characters');
  if (!/[a-z]/.test(password)) problems.push('a lowercase letter');
  if (!/[A-Z]/.test(password)) problems.push('an uppercase letter');
  if (!/\d/.test(password)) problems.push('a number');
  if (!/[^A-Za-z0-9]/.test(password)) problems.push('a symbol');
  return problems;
}

async function readCredentials() {
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    return { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD };
  }
  if (!process.stdin.isTTY) {
    throw new Error('No interactive terminal. Set ADMIN_EMAIL and ADMIN_PASSWORD for this one command instead.');
  }
  const email = await ask('Admin email: ');
  const password = await ask('Password: ', { hidden: true });
  const confirm = await ask('Confirm password: ', { hidden: true });
  if (password !== confirm) throw new Error('Passwords do not match.');
  return { email, password };
}

async function main() {
  const { email: rawEmail, password } = await readCredentials();
  const email = rawEmail.trim().toLowerCase();

  if (!EMAIL_PATTERN.test(email)) throw new Error('Please enter a valid email address.');
  const problems = passwordProblems(password);
  if (problems.length) throw new Error(`Password needs ${problems.join(', ')}.`);

  await connectDB(env.mongoUri);
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await Admin.findOne();

  if (reset) {
    const admin = await Admin.findOne({ email });
    if (!admin) throw new Error(`No admin with email ${email} exists.`);
    admin.passwordHash = passwordHash;
    admin.tokenVersion += 1;
    admin.failedLoginAttempts = 0;
    admin.lockUntil = undefined;
    await admin.save();
    console.log(`Password updated for ${email}. All existing sessions were signed out.`);
    return;
  }

  if (existing) {
    throw new Error(
      `An admin account already exists (${existing.email}). Use "npm run create-admin -- --reset" to change its password.`,
    );
  }

  await Admin.create({ email, passwordHash });
  console.log(`Admin account created for ${email}. Log in at /admin/login.`);
}

main()
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => disconnectDB());
