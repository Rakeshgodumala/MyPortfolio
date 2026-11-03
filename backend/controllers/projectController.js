import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { deleteImage } from '../services/storage.js';
import { HttpError } from '../utils/HttpError.js';
import { uniqueSlug } from '../utils/slug.js';
import { assertObjectId, throwIfInvalid, validateProject } from '../utils/validators.js';

const SORT = { displayOrder: 1, createdAt: -1 };

async function nextDisplayOrder() {
  const last = await Project.findOne().sort({ displayOrder: -1 }).select('displayOrder').lean();
  return Math.min((last?.displayOrder ?? 0) + 1, 9999);
}

async function findProjectOr404(id, withImageRef = false) {
  assertObjectId(id, 'Project');
  const query = Project.findById(id);
  if (withImageRef) query.select('+imagePublicId');
  const project = await query;
  if (!project) throw new HttpError(404, 'Project not found.');
  return project;
}

/* ---------- Public ---------- */

export async function listPublished(_req, res) {
  const projects = await Project.find({ published: true }).sort(SORT).lean();
  res.json({ projects });
}

export async function getPublishedBySlug(req, res) {
  const slug = String(req.params.slug).toLowerCase();
  const project = await Project.findOne({ slug, published: true }).lean();
  if (!project) throw new HttpError(404, 'Project not found.');
  res.json({ project });
}

/* ---------- Admin ---------- */

export async function listAll(_req, res) {
  const projects = await Project.find().sort(SORT).lean();
  res.json({ projects });
}

export async function getById(req, res) {
  const project = await findProjectOr404(req.params.id);
  res.json({ project });
}

export async function create(req, res) {
  const { data, errors } = validateProject(req.body);
  throwIfInvalid(errors);

  const project = await Project.create({
    ...data,
    slug: await uniqueSlug(Project, data.title),
    displayOrder: data.displayOrder ?? (await nextDisplayOrder()),
  });
  const { imagePublicId, ...publicFields } = project.toObject();
  res.status(201).json({ project: publicFields });
}

export async function update(req, res) {
  const project = await findProjectOr404(req.params.id, true);
  const { data, errors } = validateProject(req.body);
  throwIfInvalid(errors);

  const previousImageId = project.imagePublicId;
  const imageChanged = data.imageUrl !== project.imageUrl;
  if (!imageChanged) data.imagePublicId = previousImageId;
  if (data.title !== project.title) project.slug = await uniqueSlug(Project, data.title, project._id);
  if (data.displayOrder === undefined) delete data.displayOrder;

  project.set(data);
  await project.save();

  if (imageChanged && previousImageId) await deleteImage(previousImageId);

  const { imagePublicId, ...publicFields } = project.toObject();
  res.json({ project: publicFields });
}

export async function setPublished(req, res) {
  if (typeof req.body?.published !== 'boolean') throw new HttpError(400, '"published" must be true or false.');
  const project = await findProjectOr404(req.params.id);
  project.published = req.body.published;
  await project.save();
  res.json({ project });
}

/** Accepts the full list of project ids in their new order and renumbers them 1..n. */
export async function reorder(req, res) {
  const ids = req.body?.ids;
  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 500 || !ids.every((id) => mongoose.isValidObjectId(id))) {
    throw new HttpError(400, '"ids" must be a non-empty list of project ids.');
  }
  if (new Set(ids.map(String)).size !== ids.length) throw new HttpError(400, 'Duplicate project ids.');

  await Project.bulkWrite(
    ids.map((id, index) => ({
      updateOne: { filter: { _id: new mongoose.Types.ObjectId(String(id)) }, update: { $set: { displayOrder: index + 1 } } },
    })),
  );
  const projects = await Project.find().sort(SORT).lean();
  res.json({ projects });
}

export async function remove(req, res) {
  const project = await findProjectOr404(req.params.id, true);
  await project.deleteOne();
  await deleteImage(project.imagePublicId);
  res.status(204).end();
}
