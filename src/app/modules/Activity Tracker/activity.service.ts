import { IAuth } from './../Auth/auth.interface';
import status from 'http-status';
import { AppError } from '../../utils';
import ActivityModel from './activity.model';
import { IActivity } from './activity.interface';
import { FilterQuery } from 'mongoose';

const createActivity = async (user: IAuth, payload: Partial<IActivity>) => {
  const now = new Date();
  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const activity = await ActivityModel.findOneAndUpdate(
    {
      user: user._id,
      date: startOfDay,
    },
    {
      ...payload,
      date: startOfDay,
      user: user._id,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  if (!activity) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to create activity'
    );
  }

  return activity;
};

const getActivitiesForToday = async (user: IAuth) => {
  const now = new Date();
  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  return await ActivityModel.findOne({
    user: user._id,
    date: startOfDay,
  });
};

const updateActivity = async (user: IAuth, payload: Partial<IActivity>) => {
  const now = new Date();
  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const activity = await ActivityModel.findOne({
    user: user._id,
    date: startOfDay,
  });

  if (!activity) {
    throw new AppError(status.NOT_FOUND, 'Activity not found');
  }

  const incFields: Partial<IActivity> = {};

  if (payload?.water) {
    incFields.water = Number(payload.water);
  }

  if (payload?.step) {
    incFields.step = Number(payload.step);
  }

  if (payload?.calories) {
    incFields.calories = Number(payload.calories);
  }

  return await ActivityModel.findOneAndUpdate(
    {
      user: user._id,
      date: startOfDay,
    },
    { $inc: incFields },
    { new: true, runValidators: true }
  );
};

const getAllActivityHistory = async (user: IAuth, date?: string) => {
  const query: FilterQuery<IActivity> = { user: user._id };
  if (date) {
    const now = new Date(date);
    const startOfDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    query.date = startOfDay;
  }
  return await ActivityModel.find(query).sort({ date: -1 });
};

export const ActivityService = {
  createActivity,
  getActivitiesForToday,
  updateActivity,
  getAllActivityHistory,
};
