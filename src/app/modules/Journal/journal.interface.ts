import { Document ,Types} from 'mongoose';


export interface IJournal extends Document {
  user:Types.ObjectId,
  reflection: string;
  goals: string;
  challenges: string;
  createdAt: Date;
  updatedAt: string;
}
