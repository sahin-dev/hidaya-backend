import { Router } from 'express';
import { auth } from '../../middlewares';
import { TrackerController } from './tracker.controller';
import { ROLE } from '../Auth/auth.constant';

const router = Router();

router
  .route('/')
  .post(auth(ROLE.SUPER_ADMIN, ROLE.ADMIN), TrackerController.createTracker)
  .get(TrackerController.getAllTrackers);

router
  .route('/:id')
  .get(TrackerController.getTracker)
  .patch(auth(ROLE.SUPER_ADMIN, ROLE.ADMIN), TrackerController.updateTracker)
  .delete(auth(ROLE.SUPER_ADMIN, ROLE.ADMIN), TrackerController.deleteTracker);

export const TrackerRoutes = router;
