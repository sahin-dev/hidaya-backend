import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { HadithService } from './hadith.service';

const createHadith = asyncHandler(async (req, res) => {
  const hadith = await HadithService.createHadith(req.body);

  res
    .status(status.CREATED)
    .json(
      new AppResponse(status.CREATED, hadith, 'Hadith created successfully')
    );
});

const getHadith = asyncHandler(async (req, res) => {
  const hadith = await HadithService.getHadithById(req.params.id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, hadith, 'Hadith fetched successfully'));
});

const getAllHadiths = asyncHandler(async (_req, res) => {
  const hadiths = await HadithService.getAllHadiths();

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, hadiths, 'Hadiths fetched successfully'));
});

const getHadithsForToday = asyncHandler(async (_req, res) => {
  const hadiths = await HadithService.getHadithsForToday();

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        hadiths,
        "Today's Hadiths fetched successfully"
      )
    );
});

const updateHadith = asyncHandler(async (req, res) => {
  const updatedHadith = await HadithService.updateHadith(
    req.params.id,
    req.body
  );

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, updatedHadith, 'Hadith updated successfully')
    );
});

const deleteHadith = asyncHandler(async (req, res) => {
  await HadithService.deleteHadith(req.params.id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, null, 'Hadith deleted successfully'));
});

export const HadithController = {
  createHadith,
  getHadith,
  getAllHadiths,
  getHadithsForToday,
  updateHadith,
  deleteHadith,
};
