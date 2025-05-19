import { Document, Types } from 'mongoose';

export interface ITracker extends Document {
  category: Types.ObjectId;
  advice: string;
  dua: string;
}
