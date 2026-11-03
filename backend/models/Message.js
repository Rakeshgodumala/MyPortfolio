import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    subject: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    emailDelivered: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

messageSchema.index({ createdAt: -1 });

export const Message = mongoose.model('Message', messageSchema);
