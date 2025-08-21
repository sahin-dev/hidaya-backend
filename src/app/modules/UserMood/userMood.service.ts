/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery } from 'mongoose';
import { IAuth } from '../Auth/auth.interface';
import UserMood from './userMood.model';
import { IUserMood } from './userMood.interface';

const saveUserMoodIntoDB = async (user: IAuth, payload: IUserMood) => {
  const today = new Date(Date.now()).setHours(6,0,0,0);
  // today.setDate(today.getDate() + 1);
  

  payload.auth = user._id as any;
  payload.date = new Date(today);


  return await UserMood.create(
    // { auth: user._id, date: today },
    payload,

  );
};

const getAllUserMoodList = async (
  user: IAuth,
  query: Record<string, unknown>
) => {
  const mongoQuery: FilterQuery<IUserMood> = { auth: user._id };

  if (query?.date) {
    const date = new Date(query.date as string);
    date.setHours(6, 0, 0, 0);
    mongoQuery.date = date;
  }

  return await UserMood.find(mongoQuery);
};

const getPreviousUserMood = async (user: IAuth, startDate: Date, endDate: Date) => {
  const start = new Date(startDate);
  start.setHours(6, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(6, 0, 0, 0);

  const query: FilterQuery<IUserMood> = {
    auth: user._id,
    date: {
      $gte: start,
      $lte: end,
    },
  };

  return await UserMood.find(query).sort({ date: 1 }); // optional: sort by date
};

const editUserMood = async (moodId: string, payload: Partial<IUserMood>) => {
  const mood = await UserMood.findById(moodId);
  if (!mood) {  
    throw new Error('Mood not found');
  }
  
  return await UserMood.findOneAndUpdate(
    { _id: mood._id},
   {title: payload.title, description: payload.description},
    { new: true, upsert: true }
  );
}

const deleteUserMood = async (moodId: string) => {
  
    const mood = await UserMood.findById(moodId);
    if (!mood) {  
      throw new Error('Mood not found');
    }
  return await UserMood.findOneAndDelete({
   _id: mood._id,
  });
}



export const UserMoodService = {
  saveUserMoodIntoDB,
  getAllUserMoodList,
  getPreviousUserMood,
  editUserMood,
  deleteUserMood,
};
