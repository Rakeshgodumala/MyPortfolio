import mongoose from 'mongoose';
import { isHttpUrl } from '../utils/validators.js';

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    issuer: { type: String, required: true, trim: true, maxlength: 100 },
    credentialUrl: {
      type: String,
      trim: true,
      default: '',
      validate: { validator: (v) => !v || isHttpUrl(v), message: 'Must be a valid http(s) URL.' },
    },
    displayOrder: { type: Number, default: 0, min: 0, max: 9999 },
  },
  { timestamps: true, versionKey: false },
);

export const Certification = mongoose.model('Certification', certificationSchema);
