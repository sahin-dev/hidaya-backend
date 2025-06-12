import mongoose, { Schema, model } from 'mongoose';
import { IActivity } from './activity.interface';

const activitySchema = new Schema<IActivity>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    water: {
      type: Number,
      default: 0,
    },
    step: {
      type: Number,
      default: 0,
    },
    calories: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

const ActivityModel = model<IActivity>('Activity', activitySchema);

export default ActivityModel;
