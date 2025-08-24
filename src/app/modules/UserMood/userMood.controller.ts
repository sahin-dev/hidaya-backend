import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { UserMoodService } from './userMood.service';

const saveMood = asyncHandler(async (req, res) => {
  const result = await UserMoodService.saveUserMoodIntoDB(req.user, req.body);

  res
    .status(status.CREATED)
    .json(new AppResponse(status.CREATED, result, 'Mood saved successfully'));
});

const getAllUserMoodList = asyncHandler(async (req, res) => {
  const {startDate, endDate} = req.query 
  let result;



  if(startDate && endDate){
    result = await UserMoodService.getPreviousUserMood(req.user, new Date(startDate as string), new Date(endDate as string))
  }
 result = await UserMoodService.getAllUserMoodList(req.user, req.query);

  res
    .status(status.CREATED)
    .json(
      new AppResponse(status.CREATED, result, 'All mood retrieved successfully')
    );
});

const getPreviousUserMood = asyncHandler(async (req, res)=>{
  const {startDate, enddate}  = req.body
  const result =  await UserMoodService.getPreviousUserMood(req.user,startDate, enddate)

  res.status(status.OK)
  .json(new AppResponse(status.OK, result, "Mood fetched successfully"))
})

const updateUserMood = asyncHandler(async (req, res) => {
  const { moodId } = req.params;  
  const result = await UserMoodService.editUserMood(moodId, req.body);
  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Mood updated successfully'));
});

const deleteUserMood = asyncHandler(async (req, res) => {
  const { moodId } = req.params;
  await UserMoodService.deleteUserMood(moodId);
  res
    .status(status.OK)
    .json(new AppResponse(status.OK, null, 'Mood deleted successfully'));
});

export const UserController = {
  saveMood,
  getAllUserMoodList,
  getPreviousUserMood,
  updateUserMood,
  deleteUserMood
};
