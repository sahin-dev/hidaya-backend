import { FilterQuery } from 'mongoose';
import { IAuth } from '../Auth/auth.interface';
import UserMood from './userMood.model';
import { IUserMood } from './userMood.interface';

const saveUserMoodIntoDB = async (user: IAuth, trackerId: string) => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  today.setHours(0, 0, 0, 0);

  return await UserMood.findOneAndUpdate(
    { auth: user._id, date: today },
    {
      auth: user._id,
      mood: trackerId,
      date: today,
    },
    { upsert: true, setDefaultsOnInsert: true, runValidators: true, new: true }
  ).populate({
    path: 'mood',
    populate: 'category',
  });
};

const getAllUserMoodList = async (
  user: IAuth,
  query: Record<string, unknown>
) => {
  const mongoQuery: FilterQuery<IUserMood> = { auth: user._id };

  if (query?.date) {
    const date = new Date(query.date as string);
    date.setHours(0, 0, 0, 0);
    mongoQuery.date = date;
  }

  return await UserMood.find(mongoQuery).populate({
    path: 'mood',
    populate: 'category',
  });
};

export const UserMoodService = {
  saveUserMoodIntoDB,
  getAllUserMoodList,
};
