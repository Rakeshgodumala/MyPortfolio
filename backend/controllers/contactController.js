import { Message } from '../models/Message.js';
import { isMailConfigured, sendContactEmail } from '../services/mailer.js';
import { HttpError } from '../utils/HttpError.js';
import { assertObjectId, throwIfInvalid, validateContact } from '../utils/validators.js';

/**
 * Every valid message is stored in MongoDB (visible in the admin dashboard) and, when SMTP is
 * configured, also emailed to the portfolio owner. The visitor is only told "sent" once at least
 * the database write has succeeded.
 */
export async function submit(req, res) {
  // Honeypot field: hidden from people, but naive bots fill it in.
  if (req.body?.website) {
    res.status(202).json({ message: 'Thank you! Your message has been sent.' });
    return;
  }

  const { data, errors } = validateContact(req.body);
  throwIfInvalid(errors);

  const saved = await Message.create(data);

  if (isMailConfigured()) {
    try {
      await sendContactEmail(data);
      saved.emailDelivered = true;
      await saved.save();
    } catch (error) {
      console.error('Contact email failed (message is still saved in the database):', error.message);
    }
  }

  res.status(201).json({ message: 'Thank you! Your message has been sent. I will get back to you soon.' });
}

/* ---------- Admin ---------- */

export async function list(_req, res) {
  const messages = await Message.find().sort({ createdAt: -1 }).limit(200).lean();
  res.json({ messages });
}

export async function setRead(req, res) {
  assertObjectId(req.params.id, 'Message');
  const read = req.body?.read !== false;
  const message = await Message.findByIdAndUpdate(req.params.id, { read }, { returnDocument: 'after' });
  if (!message) throw new HttpError(404, 'Message not found.');
  res.json({ message });
}

export async function remove(req, res) {
  assertObjectId(req.params.id, 'Message');
  const deleted = await Message.findByIdAndDelete(req.params.id);
  if (!deleted) throw new HttpError(404, 'Message not found.');
  res.status(204).end();
}
