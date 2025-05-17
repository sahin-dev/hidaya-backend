import { Document } from 'mongoose';

export interface IPolicy extends Document {
  content: string;
}
