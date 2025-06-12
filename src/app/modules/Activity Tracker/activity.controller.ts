import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { ActivityService } from './activity.service';

const createActivity = asyncHandler(async (req, res) => {
  const activity = await ActivityService.createActivity(req.user, req.body);

  res
    .status(status.CREATED)
    .json(
      new AppResponse(status.CREATED, activity, 'Activity created successfully')
    );
});

const getActivitiesForToday = asyncHandler(async (req, res) => {
  const activities = await ActivityService.getActivitiesForToday(req.user);

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

// New: Get all activity history for the user
const getAllActivityHistory = asyncHandler(async (req, res) => {

  const activities = await ActivityService.getAllActivityHistory(req.user);

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
  getActivitiesForToday,
  updateActivity,
  getAllActivityHistory,
};
