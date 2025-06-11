import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { DailyPrayerLogService } from './prayer.service';

const updatePrayer = asyncHandler(async (req, res) => {
  const result = await DailyPrayerLogService.updatePrayerIntoDB(
    req.user,
    req.body
  );

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Prayer update successfully'));
});

export const PrayerController = {
  updatePrayer,
};
