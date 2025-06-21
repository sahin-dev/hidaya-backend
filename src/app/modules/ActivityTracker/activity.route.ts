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

router
  .route('/history-by-date')
  .get(auth(), ActivityController.getActivityHistoryByDateRange);

export const ActivityRoutes = router;
