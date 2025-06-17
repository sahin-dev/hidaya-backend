import { FilterQuery } from 'mongoose';
import { IAuth } from '../Auth/auth.interface';
import UserMood from './userMood.model';
import { IUserMood } from './userMood.interface';

const saveUserMoodIntoDB = async (user: IAuth, trackerId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await UserMood.create({
    user: user._id,
    mood: trackerId,
    date: today,
  });
};

const getAllUserMoodList = async (
  user: IAuth,
  query: Record<string, unknown>
) => {
  const mongoQuery: FilterQuery<IUserMood> = { auth: user._id };

  return await UserMood.find(mongoQuery);
};

export const UserMoodService = {
  saveUserMoodIntoDB,
  getAllUserMoodList,
};
