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
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Journal = model<IJournal>('Journal', journalSchema);

export default Journal;
