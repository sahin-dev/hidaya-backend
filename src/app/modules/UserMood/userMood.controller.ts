import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { UserMoodService } from './userMood.service';

const saveMood = asyncHandler(async (req, res) => {
  
  const result = await UserMoodService.saveUserMoodIntoDB(
    req.user,
    req.body.trackerId
  );

  res
    .status(status.CREATED)
    .json(new AppResponse(status.CREATED, result, 'Mood saved successfully'));
});

const getAllUserMoodList = asyncHandler(async (req, res) => {
  const result = await UserMoodService.getAllUserMoodList(req.user, req.query);

  res
    .status(status.CREATED)
    .json(
      new AppResponse(status.CREATED, result, 'All mood retrieved successfully')
    );
});

export const UserController = {
  saveMood,
  getAllUserMoodList,
};
