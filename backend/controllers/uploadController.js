import { detectImageType, saveImage } from '../services/storage.js';
import { HttpError } from '../utils/HttpError.js';

export async function uploadImage(req, res) {
  if (!req.file) throw new HttpError(400, 'Choose an image to upload.');

  const ext = detectImageType(req.file.buffer);
  if (!ext) throw new HttpError(400, 'The file is not a valid JPEG, PNG or WebP image.');

  const stored = await saveImage(req.file.buffer, ext);
  res.status(201).json(stored);
}
