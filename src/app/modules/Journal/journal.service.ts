import status from 'http-status';
import { AppError } from '../../utils';
import Journal from './journal.model';
import { IJournal } from './journal.interface';
import { FilterQuery } from 'mongoose';

const createJournal = async (payload: IJournal) => {
  console.log(payload)
  const journal = await Journal.create(payload);

  if (!journal) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to create journal'
    );
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

const getAllJournals = async (query: Record<string, unknown>) => {
  const filterQuery: FilterQuery<IJournal> = {};

  if (query?.date) {
    const date = new Date(query.date as string);
    date.setHours(0, 0, 0, 0); // start of today

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1); // start of tomorrow

    filterQuery.createdAt = {
      $gte: date,
      $lte: nextDate,
    };
  }
  return await Journal.find(filterQuery);
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
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to update journal'
    );
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
  updateJournal,
  deleteJournal,
};
