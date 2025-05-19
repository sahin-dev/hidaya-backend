import { Document } from 'mongoose';

export interface IHadith extends Document {
  date: Date;
  source: string;
  content: string;
}
