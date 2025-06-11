import { Schema, model } from 'mongoose';
import { IDailyPrayerLog } from './prayer.interface';
import { PRAYER_NAMES } from './prayer.constant';

const prayerSchema = new Schema(
  {
    name: {
      type: String,
      enum: Object.values(PRAYER_NAMES),
      required: true,
    },
    time: {
      type: String, // e.g., "05:03 AM"
      required: true,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false, versionKey: false }
);

const dailyPrayerLogSchema = new Schema<IDailyPrayerLog>(
  {
    auth: {
      type: Schema.Types.ObjectId,
      ref: 'Auth',
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    prayers: [prayerSchema],
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a user has only one log per day
dailyPrayerLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyPrayerLog = model<IDailyPrayerLog>(
  'DailyPrayerLog',
  dailyPrayerLogSchema
);
