import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares';
import { PolicyValidation } from './policy.validation';
import { PolicyController } from './policy.controller';

const router = Router();

router
  .route('/create-or-update')
  .put(
    auth('SUPER_ADMIN'),
    validateRequest(PolicyValidation.cteateSchema),
    PolicyController.savePolicy
  )
  
  router.route("/").get(PolicyController.getPolicy);

export const PolicyRoutes = router;
