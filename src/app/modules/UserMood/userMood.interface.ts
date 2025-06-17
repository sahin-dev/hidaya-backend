import { Document, Types } from 'mongoose';

export interface IUserMood extends Document {
  auth: Types.ObjectId;
  mood: Types.ObjectId;
  date: Date;
}
