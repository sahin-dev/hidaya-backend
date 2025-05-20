import status from 'http-status';
import { AppError } from '../../utils';
import ActivityModel from './activity.model';
import { IActivity } from './activity.interface';

interface ActivityUpdatePayload {
  water?: number;
  step?: number;
  calories?: number;
  user: string; // user ID
}

const createActivity = async (payload: Partial<IActivity>) => {
  const activity = await ActivityModel.create(payload);

  if (!activity) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to create activity');
  }

  return activity;
};

const getActivityById = async (id: string) => {
  const activity = await ActivityModel.findById(id);

  if (!activity) {
    throw new AppError(status.NOT_FOUND, 'Activity not found');
  }

  return activity;
};

const getActivitiesByUser = async (userId: string) => {
  return await ActivityModel.find({ user: userId });
};

/**
 * Get activities for today (user specific)
 */
const getActivitiesForToday = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const activities = await ActivityModel.find({
    user: userId,
    createdAt: {
      $gte: today,
      $lt: tomorrow,
    },
  });

  return activities;
};

const updateActivity = async (userId: string, payload: ActivityUpdatePayload) => {
  let activity = await ActivityModel.findOne({ user: userId });

  if (!activity) {
    activity = await ActivityModel.create({ user: userId, water: 0, step: 0, calories: 0 });
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

const deleteActivity = async (id: string) => {
  const activity = await ActivityModel.findById(id);

  if (!activity) {
    throw new AppError(status.NOT_FOUND, 'Activity not found');
  }

  await ActivityModel.findByIdAndDelete(id);

  return null;
};

export const ActivityService = {
  createActivity,
  getActivityById,
  getActivitiesByUser,
  getActivitiesForToday,
  updateActivity,
  deleteActivity,
};
