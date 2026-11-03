import mongoose from 'mongoose';
import { isHttpUrl } from '../utils/validators.js';

const optionalUrl = {
  validator: (value) => !value || isHttpUrl(value),
  message: 'Must be a valid http(s) URL.',
};

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true, minlength: 20, maxlength: 2000 },
    technologies: {
      type: [{ type: String, trim: true, maxlength: 40 }],
      validate: { validator: (list) => list.length <= 20, message: 'Add up to 20 technologies.' },
    },
    category: { type: String, trim: true, maxlength: 50, default: 'Web App' },
    githubUrl: { type: String, trim: true, default: '', validate: optionalUrl },
    liveDemoUrl: { type: String, trim: true, default: '', validate: optionalUrl },
    imageUrl: { type: String, trim: true, default: '' },
    // Storage reference used to delete the image later; never sent to public visitors.
    imagePublicId: { type: String, default: '', select: false },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0, min: 0, max: 9999 },
  },
  { timestamps: true, versionKey: false },
);

projectSchema.index({ published: 1, displayOrder: 1 });

export const Project = mongoose.model('Project', projectSchema);
