import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares'; // Assuming auth middleware location
import { PrayerController } from './prayer.controller';
import { PrayerValidation } from './prayer.validation';

const router = Router();

router
  .route('/')
  .get(auth(), PrayerController.fetchPrayerLogs)
  .put(
    auth(),
    validateRequest(PrayerValidation.prayerSchema),
    PrayerController.updatePrayer
  );

router.route('/times').get(auth(), PrayerController.fetchPrayerTimes);

export const PrayerLogRoutes = router;
