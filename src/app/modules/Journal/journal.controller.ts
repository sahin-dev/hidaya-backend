import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { JournalService } from './journal.service';
import { Types } from 'mongoose';

const createJournal = asyncHandler(async (req, res) => {
  const id = req.user._id

  const journal = await JournalService.createJournal(id as Types.ObjectId,req.body);

  res
    .status(status.CREATED)
    .json(
      new AppResponse(status.CREATED, journal, 'Journal created successfully')
    );
});

const getJournal = asyncHandler(async (req, res) => {
  const journal = await JournalService.getJournalById(req.params.id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, journal, 'Journal fetched successfully'));
});

const getAllJournals = asyncHandler(async (req, res) => {
  const id = req.user.id
  const journals = await JournalService.getAllJournals(id as Types.ObjectId,req.query);

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, journals, 'Journals fetched successfully')
    );
});



const updateJournal = asyncHandler(async (req, res) => {
  const updatedJournal = await JournalService.updateJournal(
    req.params.id,
    req.body
  );

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, updatedJournal, 'Journal updated successfully')
    );
});

const deleteJournal = asyncHandler(async (req, res) => {
  await JournalService.deleteJournal(req.params.id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, null, 'Journal deleted successfully'));
});

export const JournalController = {
  createJournal,
  getJournal,
  getAllJournals,
  updateJournal,
  deleteJournal,
};
