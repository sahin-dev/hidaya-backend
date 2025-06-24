import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares';
import { JournalController } from './journal.controller';
import { JournalValidation } from './journal.validation';

const router = Router();

router
  .route('/')
  .post(
    auth(),
    validateRequest(JournalValidation.createSchema),
    JournalController.createJournal
  )
  .get(JournalController.getAllJournals);

router
  .route('/:id')
  .get(JournalController.getJournal)
  .patch(
    auth(),
    validateRequest(JournalValidation.updateSchema),
    JournalController.updateJournal
  )
  .delete(auth(), JournalController.deleteJournal);

export const JournalRoutes = router;
