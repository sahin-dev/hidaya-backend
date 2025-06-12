import { IAuth } from './../Auth/auth.interface';
import status from 'http-status';
import { AppError } from '../../utils';
import ActivityModel from './activity.model';
import { IActivity } from './activity.interface';

interface ActivityUpdatePayload {
  water?: number;
  step?: number;
  calories?: number;
  user: string;
}

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

const updateActivity = async (
  userId: string,
  payload: ActivityUpdatePayload
) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  let activity = await ActivityModel.findOne({
    user: userId,
    createdAt: { $gte: todayStart, $lt: tomorrowStart },
  });

  if (!activity) {
    activity = await ActivityModel.create({
      user: userId,
      water: 0,
      step: 0,
      calories: 0,
    });
  }

  if (typeof payload.water === 'number') {
    activity.water += payload.water;
  }
  if (typeof payload.step === 'number') {
    activity.step += payload.step;
  }
  if (typeof payload.calories === 'number') {
    activity.calories += payload.calories;
  }

  await activity.save();

  return activity;
};

const getAllActivityHistory = async (user: IAuth) => {
  return await ActivityModel.find({ user: user._id }).sort({ date: -1 });
};

export const ActivityService = {
  createActivity,
  getActivitiesForToday,
  updateActivity,
  getAllActivityHistory,
};
