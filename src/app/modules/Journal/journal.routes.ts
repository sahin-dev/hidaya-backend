import { Router } from 'express';
import { auth } from '../../middlewares';
import { JournalController } from './journal.controller';

const router = Router();

router
  .route('/')
  .post(auth(), JournalController.createJournal)
  .get(JournalController.getAllJournals);

router.route('/today').get(JournalController.getJournalsForToday);

router
  .route('/:id')
  .get(JournalController.getJournal)
  .patch(auth(), JournalController.updateJournal)
  .delete(auth(), JournalController.deleteJournal);

export const JournalRoutes = router;
