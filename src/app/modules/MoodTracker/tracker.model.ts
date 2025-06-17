import mongoose, { Schema, model } from 'mongoose';
import { ITracker } from './tracker.interface';

const trackerSchema = new Schema<ITracker>(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    advice: { type: String, required: true },
    dua: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Tracker = model<ITracker>('Tracker', trackerSchema);

export default Tracker;
