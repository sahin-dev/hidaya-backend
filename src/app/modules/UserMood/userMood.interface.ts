import { Document, Types } from 'mongoose';

export interface IUserMood extends Document {
  auth: Types.ObjectId;
  title: string;
  description: string;
  date: Date;
}
