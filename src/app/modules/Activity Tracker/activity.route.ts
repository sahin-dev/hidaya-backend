import { Router } from 'express';
import { auth } from '../../middlewares';
import { ActivityController } from './activity.controller';
import { ROLE } from '../Auth/auth.constant';

const router = Router();

router
  .route('/')
  .post(
    auth(ROLE.USER, ROLE.SUPER_ADMIN, ROLE.ADMIN),
    ActivityController.createActivity
  )
  .get(
    auth(ROLE.USER, ROLE.SUPER_ADMIN, ROLE.ADMIN),
    ActivityController.getActivitiesByUser
  );

router
  .route('/today')
  .get(
    auth(ROLE.USER, ROLE.SUPER_ADMIN, ROLE.ADMIN),
    ActivityController.getActivitiesForToday
  );

router
  .route('/:id')
  .get(
    auth(ROLE.USER, ROLE.SUPER_ADMIN, ROLE.ADMIN),
    ActivityController.getActivity
  )
  .patch(
    auth(ROLE.USER, ROLE.SUPER_ADMIN, ROLE.ADMIN),
    ActivityController.updateActivity
  )
  .delete(
    auth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
    ActivityController.deleteActivity
  );

export const ActivityRoutes = router;
