import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares';
import { TermsValidation } from './terms.validation';
import { TermsController } from './terms.controller';

const router = Router();

router
  .route('/')
  .put(
    auth('SUPER_ADMIN'),
    validateRequest(TermsValidation.cteateSchema),
    TermsController.saveTerms
  )
  .get(TermsController.getTerms);

export const TermsRoutes = router;
