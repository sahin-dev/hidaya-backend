import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares';
import { UserController } from './userMood.controller';
import { MoodValidation } from './userMood.validation';

const router = Router();

router
  .route('/')
  .post(
    auth(),
    validateRequest(MoodValidation.createSchema),
    UserController.saveMood
  )
  .get(auth(), UserController.getAllUserMoodList);
  
  router
  .route('/:moodId')
  .put(auth(),UserController.updateUserMood) 
  .delete(auth(), UserController.deleteUserMood); 

export const UserMoodRoutes = router;
