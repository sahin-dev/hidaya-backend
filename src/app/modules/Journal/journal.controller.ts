import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { JournalService } from './journal.service';

const createJournal = asyncHandler(async (req, res) => {
  const journal = await JournalService.createJournal(req.body);

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
  const journals = await JournalService.getAllJournals(req.query);

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
