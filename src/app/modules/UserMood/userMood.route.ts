import { Router } from 'express';
import { auth } from '../../middlewares';
import { UserController } from './userMood.controller';

const router = Router();

router
  .route('/')
  .post(auth(), UserController.saveMood)
  .get(auth(), UserController.getAllUserMoodList);

export const UserMoodRoutes = router;
