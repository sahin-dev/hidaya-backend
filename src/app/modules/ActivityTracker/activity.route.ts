import { Router } from 'express';
import { auth } from '../../middlewares';
import { ActivityController } from './activity.controller';

const router = Router();

router
  .route('/')
  .post(auth(), ActivityController.createActivity)
  .patch(auth(), ActivityController.updateActivity);

router.route('/today').get(auth(), ActivityController.getActivitiesForToday);

router.route('/history').get(auth(), ActivityController.getAllActivityHistory);

export const ActivityRoutes = router;
