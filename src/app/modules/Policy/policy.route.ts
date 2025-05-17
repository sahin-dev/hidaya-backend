import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares';
import { PolicyValidation } from './policy.validation';
import { PolicyController } from './policy.controller';

const router = Router();

router
  .route('/')
  .put(
    auth('SUPER_ADMIN'),
    validateRequest(PolicyValidation.cteateSchema),
    PolicyController.savePolicy
  )
  .get(PolicyController.getPolicy);

export const PolicyRoutes = router;
