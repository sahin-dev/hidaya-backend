import { Document } from 'mongoose';

export interface ITerms extends Document {
  content: string;
}
