import { Router } from 'express';
import { auth } from '../../middlewares';
import { ActivityController } from './activity.controller';

const router = Router();

router
  .route('/')
  .post(auth(), ActivityController.createActivity)
  .get(auth(), ActivityController.getActivitiesByUser)
  .patch(auth(), ActivityController.updateActivity);

router.route('/today').get(auth(), ActivityController.getActivitiesForToday);

router.route('/by-date').get(auth(), ActivityController.getActivitiesByDate);

router.route('/history').get(auth(), ActivityController.getAllActivityHistory);

router
  .route('/:id')
  .get(auth(), ActivityController.getActivity)
  .delete(auth(), ActivityController.deleteActivity);

export const ActivityRoutes = router;
