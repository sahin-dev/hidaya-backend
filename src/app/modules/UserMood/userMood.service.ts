/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery } from 'mongoose';
import { IAuth } from '../Auth/auth.interface';
import UserMood from './userMood.model';
import { IUserMood } from './userMood.interface';

const saveUserMoodIntoDB = async (user: IAuth, payload: IUserMood) => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  today.setHours(0, 0, 0, 0);

  payload.auth = user._id as any;

  return await UserMood.findOneAndUpdate(
    { auth: user._id, date: today },
    payload,
    { upsert: true, setDefaultsOnInsert: true, runValidators: true, new: true }
  );
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

  return await UserMood.find(mongoQuery);
};

export const UserMoodService = {
  saveUserMoodIntoDB,
  getAllUserMoodList,
};
