import { Document, Types } from 'mongoose';
import { TPrayer } from './prayer.constant';

export interface IDailyPrayerLog extends Document {
  auth: Types.ObjectId;
  date: Date;
  prayers: {
    name: TPrayer;
    time: string;
    isComplete: boolean;
  }[];
}
