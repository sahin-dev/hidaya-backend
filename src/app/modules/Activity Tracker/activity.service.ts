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

const createActivity = async (payload: Partial<IActivity>) => {
  const activity = await ActivityModel.create(payload);

  if (!activity) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to create activity'
    );
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

const deleteActivity = async (id: string) => {
  const activity = await ActivityModel.findById(id);

  if (!activity) {
    throw new AppError(status.NOT_FOUND, 'Activity not found');
  }

  await ActivityModel.findByIdAndDelete(id);

  return null;
};

const getActivitiesByDate = async (userId: string, dateStr: string) => {
  if (!dateStr) {
    throw new AppError(status.BAD_REQUEST, 'Date params is required');
  }
  // Parse dateStr "DD-MM-YYYY"
  const [day, month, year] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const activities = await ActivityModel.find({
    user: userId,
    createdAt: { $gte: start, $lt: end },
  });

  return activities;
};

const getAllActivityHistory = async (userId: string) => {
  return await ActivityModel.find({ user: userId }).sort({ createdAt: -1 });
};

export const ActivityService = {
  createActivity,
  getActivityById,
  getActivitiesByUser,
  getActivitiesForToday,
  updateActivity,
  deleteActivity,
  getActivitiesByDate,
  getAllActivityHistory,
};
