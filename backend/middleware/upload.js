import multer from 'multer';
import { HttpError } from '../utils/HttpError.js';

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

// Files are kept in memory only long enough to verify their contents and forward them to storage.
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1, fields: 5 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.has(file.mimetype)) cb(null, true);
    else cb(new HttpError(400, 'Only JPEG, PNG or WebP images are allowed.'));
  },
}).single('image');
