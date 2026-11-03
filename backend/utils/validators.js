import mongoose from 'mongoose';
import { HttpError } from './HttpError.js';

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Trims a multi-line string and removes control characters (keeps tabs and newlines). */
export const cleanText = (value) => (typeof value === 'string' ? value.replace(CONTROL_CHARS, '').trim() : '');

/** Single-line variant: also collapses newlines, so values are safe in email headers. */
export const cleanLine = (value) => cleanText(value).replace(/[\r\n\t]+/g, ' ');

export function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const isLocalUploadPath = (value) => /^\/uploads\/[a-f0-9]{32}\.(jpg|png|webp)$/.test(value);

const toBoolean = (value) => value === true || value === 'true' || value === 'on' || value === 1;

export function assertObjectId(id, label = 'Item') {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(404, `${label} not found.`);
}

function checkLength(errors, field, value, { min = 0, max, label }) {
  if (value.length < min) {
    errors[field] = value.length === 0 ? `${label} is required.` : `${label} must be at least ${min} characters.`;
  } else if (value.length > max) {
    errors[field] = `${label} must be ${max} characters or fewer.`;
  }
}

function checkOptionalUrl(errors, field, value, label) {
  if (!value) return;
  if (value.length > 300) errors[field] = `${label} must be 300 characters or fewer.`;
  else if (!isHttpUrl(value)) errors[field] = `${label} must be a valid URL starting with https://`;
}

function parseOrder(value, errors) {
  if (value === undefined || value === null || value === '') return undefined;
  const order = Number(value);
  if (!Number.isInteger(order) || order < 0 || order > 9999) {
    errors.displayOrder = 'Display order must be a whole number between 0 and 9999.';
    return undefined;
  }
  return order;
}

export function validateProject(body = {}) {
  const errors = {};
  const data = {
    title: cleanLine(body.title),
    description: cleanText(body.description),
    category: cleanLine(body.category) || 'Web App',
    githubUrl: cleanLine(body.githubUrl),
    liveDemoUrl: cleanLine(body.liveDemoUrl),
    imageUrl: cleanLine(body.imageUrl),
    imagePublicId: cleanLine(body.imagePublicId),
    featured: toBoolean(body.featured),
    published: toBoolean(body.published),
  };

  checkLength(errors, 'title', data.title, { min: 3, max: 100, label: 'Title' });
  checkLength(errors, 'description', data.description, { min: 20, max: 2000, label: 'Description' });
  checkLength(errors, 'category', data.category, { max: 50, label: 'Category' });
  checkOptionalUrl(errors, 'githubUrl', data.githubUrl, 'GitHub URL');
  checkOptionalUrl(errors, 'liveDemoUrl', data.liveDemoUrl, 'Live demo URL');

  if (data.imageUrl && !isHttpUrl(data.imageUrl) && !isLocalUploadPath(data.imageUrl)) {
    errors.imageUrl = 'Upload the image through the dashboard or use a valid https:// image URL.';
  }
  if (data.imagePublicId.length > 200) errors.imageUrl = 'Invalid image reference.';
  if (!data.imageUrl) data.imagePublicId = '';

  const rawTech = Array.isArray(body.technologies)
    ? body.technologies
    : typeof body.technologies === 'string'
      ? body.technologies.split(',')
      : [];
  const seen = new Set();
  data.technologies = rawTech.map(cleanLine).filter((tech) => {
    const key = tech.toLowerCase();
    if (!tech || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (data.technologies.length > 20) errors.technologies = 'Add up to 20 technologies.';
  else if (data.technologies.some((tech) => tech.length > 40)) {
    errors.technologies = 'Each technology must be 40 characters or fewer.';
  }

  data.displayOrder = parseOrder(body.displayOrder, errors);
  return { data, errors };
}

export function validateCertification(body = {}) {
  const errors = {};
  const data = {
    title: cleanLine(body.title),
    issuer: cleanLine(body.issuer),
    credentialUrl: cleanLine(body.credentialUrl),
  };
  checkLength(errors, 'title', data.title, { min: 3, max: 150, label: 'Title' });
  checkLength(errors, 'issuer', data.issuer, { min: 2, max: 100, label: 'Issuer' });
  checkOptionalUrl(errors, 'credentialUrl', data.credentialUrl, 'Verification URL');
  data.displayOrder = parseOrder(body.displayOrder, errors);
  return { data, errors };
}

export function validateContact(body = {}) {
  const errors = {};
  const data = {
    name: cleanLine(body.name),
    email: cleanLine(body.email).toLowerCase(),
    subject: cleanLine(body.subject),
    message: cleanText(body.message),
  };
  checkLength(errors, 'name', data.name, { min: 2, max: 80, label: 'Name' });
  if (!EMAIL_PATTERN.test(data.email) || data.email.length > 120) errors.email = 'Enter a valid email address.';
  checkLength(errors, 'subject', data.subject, { min: 3, max: 120, label: 'Subject' });
  checkLength(errors, 'message', data.message, { min: 10, max: 3000, label: 'Message' });
  return { data, errors };
}

/** Throws a 400 carrying per-field messages that the frontend shows next to each input. */
export function throwIfInvalid(errors) {
  if (Object.keys(errors).length) {
    throw new HttpError(400, 'Please fix the highlighted fields.', errors);
  }
}
