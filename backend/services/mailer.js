import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter;

export function isMailConfigured() {
  const { host, user, pass } = env.smtp;
  return Boolean(host && user && pass && env.contactToEmail);
}

function getTransporter() {
  transporter ??= nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
  return transporter;
}

/** Sends a contact-form message to the portfolio owner. Plain text only, so no HTML is rendered. */
export async function sendContactEmail({ name, email, subject, message }) {
  await getTransporter().sendMail({
    from: { name: 'Portfolio Contact Form', address: env.contactFromEmail || env.smtp.user },
    to: env.contactToEmail,
    replyTo: { name, address: email },
    subject: `[Portfolio] ${subject}`,
    text: `New message from your portfolio contact form\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}\n`,
  });
}
