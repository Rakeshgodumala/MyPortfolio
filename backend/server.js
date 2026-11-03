import { createApp } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { assertServerEnv, env } from './config/env.js';
import { isMailConfigured } from './services/mailer.js';
import { storageMode } from './services/storage.js';

async function start() {
  assertServerEnv();
  await connectDB(env.mongoUri);
  console.log('MongoDB connected');

  const mode = storageMode();
  if (mode === 'local') console.warn('Image storage: local disk (development only). Set CLOUDINARY_URL for production.');
  if (mode === 'unconfigured') console.warn('Image storage is NOT configured: uploads will be rejected until CLOUDINARY_URL is set.');
  if (!isMailConfigured()) console.warn('SMTP is not configured: contact messages are saved to the database but not emailed.');

  const server = createApp().listen(env.port, () => {
    console.log(`API listening on port ${env.port} (${env.nodeEnv})`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
