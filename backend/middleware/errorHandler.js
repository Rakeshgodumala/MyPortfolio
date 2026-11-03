import mongoose from 'mongoose';
import multer from 'multer';
import { HttpError } from '../utils/HttpError.js';

export function notFound(req, _res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  let status = err.status || err.statusCode || 500;
  let message = err.message;
  let errors = err.errors && err instanceof HttpError ? err.errors : undefined;

  if (err instanceof multer.MulterError) {
    status = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 2 MB or smaller.' : 'Invalid file upload.';
  } else if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = 'Please fix the highlighted fields.';
    errors = Object.fromEntries(Object.entries(err.errors).map(([field, e]) => [field.split('.')[0], e.message]));
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = 'Invalid value supplied.';
  } else if (err?.code === 11000) {
    status = 409;
    message = 'A record with the same unique value already exists.';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Request body is not valid JSON.';
  } else if (err.type === 'entity.too.large') {
    status = 413;
    message = 'Request body is too large.';
  }

  if (status >= 500) {
    console.error(err);
    // Internal details are logged on the server, never sent to the browser.
    if (!(err instanceof HttpError)) message = 'Something went wrong on the server. Please try again.';
  }

  res.status(status).json(errors ? { message, errors } : { message });
}
