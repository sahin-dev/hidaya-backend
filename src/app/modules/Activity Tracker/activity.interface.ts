import { Document, Types } from 'mongoose';

export interface IActivity extends Document {
  user: Types.ObjectId;
  water: number;
  step: number;
  calories: number;
  date: Date;
  updatedAt: Date;
}
