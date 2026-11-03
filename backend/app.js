import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter, isAllowedOrigin, stripMongoOperators, verifyRequestOrigin } from './middleware/security.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import { UPLOAD_DIR, storageMode } from './services/storage.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  // Needed behind Render/Vercel so rate limiting and secure cookies see the real client.
  if (env.trustProxy) app.set('trust proxy', env.trustProxy);

  app.use(
    helmet({
      // Allows the frontend (possibly another origin) to display uploaded images.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(
    cors({
      origin: (origin, callback) => callback(null, !origin || isAllowedOrigin(origin)),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'X-Requested-With'],
      maxAge: 600,
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());
  app.use(stripMongoOperators);

  if (storageMode() === 'local') {
    app.use(
      '/uploads',
      express.static(UPLOAD_DIR, {
        maxAge: '7d',
        setHeaders: (res) => res.set('X-Content-Type-Options', 'nosniff'),
      }),
    );
  }

  app.use('/api', apiLimiter, verifyRequestOrigin);
  app.use('/api', (_req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', publicRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
