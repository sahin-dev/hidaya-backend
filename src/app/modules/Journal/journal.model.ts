import { Schema, model } from 'mongoose';
import { IJournal } from './journal.interface';

const journalSchema = new Schema<IJournal>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    water: {
      type: Number,
      required: false,
    },
    steps: {
      type: Number,
      required: false,
    },
    calories: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Journal = model<IJournal>('Journal', journalSchema);

export default Journal;
