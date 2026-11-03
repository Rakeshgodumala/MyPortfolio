import { Certification } from '../models/Certification.js';
import { HttpError } from '../utils/HttpError.js';
import { assertObjectId, throwIfInvalid, validateCertification } from '../utils/validators.js';

const SORT = { displayOrder: 1, createdAt: 1 };

export async function list(_req, res) {
  const certifications = await Certification.find().sort(SORT).lean();
  res.json({ certifications });
}

export async function create(req, res) {
  const { data, errors } = validateCertification(req.body);
  throwIfInvalid(errors);
  if (data.displayOrder === undefined) {
    data.displayOrder = (await Certification.countDocuments()) + 1;
  }
  const certification = await Certification.create(data);
  res.status(201).json({ certification });
}

export async function update(req, res) {
  assertObjectId(req.params.id, 'Certification');
  const { data, errors } = validateCertification(req.body);
  throwIfInvalid(errors);
  if (data.displayOrder === undefined) delete data.displayOrder;

  const certification = await Certification.findByIdAndUpdate(req.params.id, data, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!certification) throw new HttpError(404, 'Certification not found.');
  res.json({ certification });
}

export async function remove(req, res) {
  assertObjectId(req.params.id, 'Certification');
  const deleted = await Certification.findByIdAndDelete(req.params.id);
  if (!deleted) throw new HttpError(404, 'Certification not found.');
  res.status(204).end();
}
