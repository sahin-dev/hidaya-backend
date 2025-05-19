import status from 'http-status';
import { AppError } from '../../utils';
import Journal from './journal.model';
import { IJournal } from './journal.interface';

const createJournal = async (payload: IJournal) => {
  const journal = await Journal.create(payload);

  if (!journal) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to create journal');
  }

  return journal;
};

const getJournalById = async (id: string) => {
  const journal = await Journal.findById(id);

  if (!journal) {
    throw new AppError(status.NOT_FOUND, 'Journal not found');
  }

  return journal;
};

const getAllJournals = async () => {
  return await Journal.find();
};

/**
 * Get journals created on today's date (ignoring time)
 */
const getJournalsForToday = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of today

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // start of tomorrow

  const journals = await Journal.find({
    createdAt: {
      $gte: today,
      $lt: tomorrow,
    },
  });

  return journals;
};

const updateJournal = async (id: string, payload: Partial<IJournal>) => {
  const journal = await Journal.findById(id);

  if (!journal) {
    throw new AppError(status.NOT_FOUND, 'Journal not found');
  }

  const updatedJournal = await Journal.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!updatedJournal) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to update journal');
  }

  return updatedJournal;
};

const deleteJournal = async (id: string) => {
  const journal = await Journal.findById(id);

  if (!journal) {
    throw new AppError(status.NOT_FOUND, 'Journal not found');
  }

  await Journal.findByIdAndDelete(id);

  return null;
};

export const JournalService = {
  createJournal,
  getJournalById,
  getAllJournals,
  getJournalsForToday,
  updateJournal,
  deleteJournal,
};
