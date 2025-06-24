import { Document } from 'mongoose';

export interface IJournal extends Document {
  reflection: string;
  goals: string;
  challenges: string;
  createdAt: Date;
  updatedAt: string;
}
