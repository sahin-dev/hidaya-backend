import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares'; // Assuming auth middleware location
import { PrayerController } from './prayer.controller';
import { PrayerValidation } from './prayer.validation';

const router = Router();

router
  .route('/')
  .put(
    auth(),
    validateRequest(PrayerValidation.prayerSchema),
    PrayerController.updatePrayer
  );

export const PrayerLogRoutes = router;
