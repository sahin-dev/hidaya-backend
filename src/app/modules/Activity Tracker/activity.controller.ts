import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { ActivityService } from './activity.service';

const createActivity = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const payload = { ...req.body, user: userId };

  const activity = await ActivityService.createActivity(payload);

  res
    .status(status.CREATED)
    .json(new AppResponse(status.CREATED, activity, 'Activity created successfully'));
});

const getActivity = asyncHandler(async (req, res) => {
  const activity = await ActivityService.getActivityById(req.params.id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, activity, 'Activity fetched successfully'));
});

const getActivitiesByUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const activities = await ActivityService.getActivitiesByUser(userId);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, activities, 'User activities fetched successfully'));
});

const getActivitiesForToday = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const activities = await ActivityService.getActivitiesForToday(userId);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, activities, "Today's activities fetched successfully"));
});

const updateActivity = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const payload = req.body;

  const updatedActivity = await ActivityService.updateActivity(userId, { ...payload, user: userId });

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, updatedActivity, 'Activity updated successfully'));
});

const deleteActivity = asyncHandler(async (req, res) => {
  await ActivityService.deleteActivity(req.params.id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, null, 'Activity deleted successfully'));
});

export const ActivityController = {
  createActivity,
  getActivity,
  getActivitiesByUser,
  getActivitiesForToday,
  updateActivity,
  deleteActivity,
};
