import mongoose from 'mongoose';
import { isMailConfigured } from '../services/mailer.js';
import { storageMode } from '../services/storage.js';

export function health(_req, res) {
  const database = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(database === 'connected' ? 200 : 503).json({ status: database === 'connected' ? 'ok' : 'degraded', database });
}

/** Admin-only: tells the dashboard which optional services still need configuring. */
export function status(_req, res) {
  res.json({ imageStorage: storageMode(), email: isMailConfigured() ? 'configured' : 'not-configured' });
}
