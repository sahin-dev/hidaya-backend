import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { PrayerService } from './prayer.service';

const updatePrayer = asyncHandler(async (req, res) => {
  console.log(req.body)
  const result = await PrayerService.updatePrayerIntoDB(req.user, req.body);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Prayer update successfully'));
});

const fetchPrayerLogs = asyncHandler(async (req, res) => {
  const result = await PrayerService.fetchAllPrayerLogsFromDB(
    req.user,
    req.query.date as string
  );

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, result, 'Prayer logs retrieved successfully')
    );
});

const fetchPrayerTimes = asyncHandler(async (req, res) => {
  const result = await PrayerService.getPrayerTimes(req.user);

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, result, 'Prayer times retrieved successfully')
    );
});

export const PrayerController = {
  updatePrayer,
  fetchPrayerLogs,
  fetchPrayerTimes,
};
