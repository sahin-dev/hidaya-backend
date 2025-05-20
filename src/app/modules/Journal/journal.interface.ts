import { Document } from 'mongoose';

export interface IJournal extends Document {
  title: string;
  content: string;
  water: number;
  steps: number;
  calories: number;
  createdAt: Date;
  updatedAt: string;
}
