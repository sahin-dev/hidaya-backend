import { FilterQuery } from 'mongoose';
import { IAuth } from '../Auth/auth.interface';
import { DailyPrayerLog } from './prayer.model';
import { IDailyPrayerLog } from './prayer.interface';
import axios from 'axios';
import { PRAYER_NAMES } from './prayer.constant';

const getPrayerTimes = async (user: IAuth) => {
  const city = user?.city || 'Riyadh';
  const country = user?.country || 'Saudi Arabia';
  const response = await axios.get(`http://api.aladhan.com/v1/timingsByCity`, {
    params: {
      city,
      country,
      method: 2,
    },
  });

  const timings = response.data.data.timings;
  const zone = response.data.data.meta.timezone

  if (!timings) {
    throw new Error('Could not retrieve prayer timings from the external API.');
  }

  return Object.values(PRAYER_NAMES).map((item) => ({
    name: item,
    time: timings[item],
  }));
};

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

const fetchAllPrayerLogsFromDB = async (user: IAuth, date: string) => {
  const query: FilterQuery<IDailyPrayerLog> = { auth: user._id };

  if (date) {
    const startOfDay = new Date(date as string);
    startOfDay.setUTCHours(0, 0, 0, 0);
    query.date = startOfDay;
  }
  const logs = await DailyPrayerLog.find(query);
  const allPrayers = await getPrayerTimes(user);


  const response = logs.map((item) => {
    const { prayers, ...remainData } = item.toObject();

    return {
      ...remainData,
      prayers: allPrayers.map((item) => {
        if (prayers.find((p) => item.name === p.name)) {
          return prayers.find((p) => item.name === p.name);
        }
        return {
          ...item,
          isComplete: false,
        };
      }),
    };
  });

  const customResponse = [
    {
      auth: user._id,
      date: new Date(date),
      prayers: allPrayers?.map((item) => ({
        ...item,
        isComplete: false,
      })),
    },
  ];

  return response?.length ? response : customResponse;
};

export const PrayerService = {
  updatePrayerIntoDB,
  fetchAllPrayerLogsFromDB,
  getPrayerTimes,
};
