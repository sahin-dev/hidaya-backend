import { Router } from 'express';
import { auth } from '../../middlewares';
import { HadithController } from './hadith.controller';
import { ROLE } from '../Auth/auth.constant';

const router = Router();

router
  .route('/')
  .post(
    auth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
    HadithController.createHadith
  )
  .get(HadithController.getAllHadiths);

router
  .route('/today')
  .get(HadithController.getHadithsForToday);

router
  .route('/:id')
  .get(HadithController.getHadith)
  .patch(
    auth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
    HadithController.updateHadith
  )
  .delete(
    auth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
    HadithController.deleteHadith
  );

export const HadithRoutes = router;
