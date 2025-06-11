import { IAuth } from '../Auth/auth.interface';
import { DailyPrayerLog } from './prayer.model';

const updatePrayerIntoDB = async (
  user: IAuth,
  payload: {
    prayerName: string;
    date: string;
    time: string;
    isComplete: boolean;
  }
) => {
  const startOfDay = new Date(payload.date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const updatedLog = await DailyPrayerLog.findOneAndUpdate(
    {
      auth: user._id,
      date: startOfDay,
      'prayers.name': payload.prayerName,
    },
    {
      $set: {
        'prayers.$.time': payload.time,
        'prayers.$.isComplete': payload.isComplete,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (updatedLog) {
    return updatedLog;
  }

  return await DailyPrayerLog.findOneAndUpdate(
    {
      auth: user._id,
      date: startOfDay,
    },
    {
      $addToSet: {
        prayers: {
          name: payload.prayerName,
          time: payload.time,
          isComplete: payload.isComplete,
        },
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  );
};

export const DailyPrayerLogService = {
  updatePrayerIntoDB,
};
