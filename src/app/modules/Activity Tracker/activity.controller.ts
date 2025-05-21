import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { ActivityService } from './activity.service';

const createActivity = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const payload = { ...req.body, user: userId };

  const activity = await ActivityService.createActivity(payload);

  res
    .status(status.CREATED)
    .json(
      new AppResponse(status.CREATED, activity, 'Activity created successfully')
    );
});

const getActivity = asyncHandler(async (req, res) => {
  const activity = await ActivityService.getActivityById(req.params.id);

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, activity, 'Activity fetched successfully')
    );
});

const getActivitiesByUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const activities = await ActivityService.getActivitiesByUser(userId);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        activities,
        'User activities fetched successfully'
      )
    );
});

const getActivitiesForToday = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const activities = await ActivityService.getActivitiesForToday(userId);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        activities,
        "Today's activities fetched successfully"
      )
    );
});

const updateActivity = asyncHandler(async (req, res) => {
  const userId = req.user._id as string;

  const payload = req.body;

  const updatedActivity = await ActivityService.updateActivity(userId, {
    ...payload,
    user: userId,
  });

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        updatedActivity,
        'Activity updated successfully'
      )
    );
});

const deleteActivity = asyncHandler(async (req, res) => {
  await ActivityService.deleteActivity(req.params.id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, null, 'Activity deleted successfully'));
});

// New: Get activities by a specific date, query param 'date' in format 'DD-MM-YYYY'
const getActivitiesByDate = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const dateStr = req.query.date as string;

  const activities = await ActivityService.getActivitiesByDate(userId, dateStr);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        activities,
        `Activities for date ${dateStr} fetched successfully`
      )
    );
});

// New: Get all activity history for the user
const getAllActivityHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const activities = await ActivityService.getAllActivityHistory(userId);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        activities,
        'All activity history fetched successfully'
      )
    );
});

export const ActivityController = {
  createActivity,
  getActivity,
  getActivitiesByUser,
  getActivitiesForToday,
  updateActivity,
  deleteActivity,
  getActivitiesByDate,
  getAllActivityHistory,
};
