import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';
import { HttpError } from '../utils/HttpError.js';

export const UPLOAD_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../uploads');
const LOCAL_PREFIX = 'local:';
const LOCAL_NAME = /^[a-f0-9]{32}\.(jpg|png|webp)$/;
const CLOUDINARY_FOLDER = 'portfolio/projects';

// The Cloudinary SDK reads CLOUDINARY_URL from the environment automatically.
if (env.cloudinaryUrl) cloudinary.config({ secure: true });

/**
 * "cloudinary"   – persistent storage (use in production)
 * "local"        – files in backend/uploads (development only; wiped on most hosts on redeploy)
 * "unconfigured" – production without Cloudinary: uploads are refused rather than silently lost
 */
export function storageMode() {
  if (env.cloudinaryUrl) return 'cloudinary';
  return env.isProd ? 'unconfigured' : 'local';
}

/** Detects the real image type from the file's magic bytes instead of trusting the client. */
export function detectImageType(buffer) {
  if (!buffer || buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpg';
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  return null;
}

export async function saveImage(buffer, ext) {
  const mode = storageMode();

  if (mode === 'cloudinary') {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: CLOUDINARY_FOLDER,
            resource_type: 'image',
            allowed_formats: ['jpg', 'png', 'webp'],
            transformation: [{ width: 1600, crop: 'limit' }],
          },
          (error, uploaded) => (error ? reject(error) : resolve(uploaded)),
        )
        .end(buffer);
    });
    return { imageUrl: result.secure_url, imagePublicId: result.public_id };
  }

  if (mode === 'local') {
    const name = `${crypto.randomBytes(16).toString('hex')}.${ext}`;
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), buffer);
    return { imageUrl: `/uploads/${name}`, imagePublicId: `${LOCAL_PREFIX}${name}` };
  }

  throw new HttpError(
    503,
    'Image storage is not configured. Set CLOUDINARY_URL on the backend to enable uploads in production.',
  );
}

/** Best-effort removal of a stored image. Failures are logged, not thrown. */
export async function deleteImage(publicId) {
  if (!publicId) return;
  try {
    if (publicId.startsWith(LOCAL_PREFIX)) {
      const name = publicId.slice(LOCAL_PREFIX.length);
      if (LOCAL_NAME.test(name)) await fs.rm(path.join(UPLOAD_DIR, name), { force: true });
    } else if (env.cloudinaryUrl && publicId.startsWith(`${CLOUDINARY_FOLDER}/`)) {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    }
  } catch (error) {
    console.warn(`Could not delete image ${publicId}:`, error.message);
  }
}
