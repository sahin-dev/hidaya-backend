import mongoose from 'mongoose';
import { IUserMood } from './userMood.interface';

const UserMoodSchema = new mongoose.Schema<IUserMood>({
  auth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const UserMood = mongoose.model<IUserMood>('UserMood', UserMoodSchema);

export default UserMood;
