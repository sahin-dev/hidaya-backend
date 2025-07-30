import mongoose, { Schema, model } from 'mongoose';
import { IJournal } from './journal.interface';

const journalSchema = new Schema<IJournal>(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
      },
    reflection: {
      type: String,
      required: [true, 'Reflection is required'],
    },
    goals: {
      type: String,
      required: [true, 'Content is required'],
    },
    challenges: {
      type: String,
      required: [true, 'Challenges is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Journal = model<IJournal>('Journal', journalSchema);

export default Journal;
