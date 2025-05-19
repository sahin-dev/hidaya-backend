import { Document } from 'mongoose';

export interface IJournal extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: string;
}
