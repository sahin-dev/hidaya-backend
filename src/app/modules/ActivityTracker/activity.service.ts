/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAuth } from './../Auth/auth.interface';
import status from 'http-status';
import { AppError } from '../../utils';
import ActivityModel from './activity.model';
import { IActivity } from './activity.interface';
import { FilterQuery } from 'mongoose';

const createActivity = async (user: IAuth, payload: Partial<IActivity>) => {
  const now = new Date();
  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const data = { ...payload, calories: Number(payload.step) * 0.04 };

  const activity = await ActivityModel.findOneAndUpdate(
    {
      user: user._id,
      date: startOfDay,
    },
    {
      ...data,
      date: startOfDay,
      user: user._id,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  if (!activity) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to create activity'
    );
  }

  return activity;
};

const getActivitiesForToday = async (user: IAuth) => {
  const now = new Date();
  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  return await ActivityModel.findOne({
    user: user._id,
    date: startOfDay,
  });
};

const updateActivity = async (user: IAuth, payload: Partial<IActivity>) => {
  const now = new Date();
  const startOfDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const incFields: Partial<IActivity> = {};

  if (payload?.water) {
    incFields.water = Number(payload.water);
  }

  if (payload?.step) {
    incFields.step = Number(payload.step);
    incFields.calories = Number(payload.step) * 0.04;
  }

  if (payload?.calories) {
    incFields.calories = Number(payload.calories);
  }

  return await ActivityModel.findOneAndUpdate(
    {
      user: user._id,
      date: startOfDay,
    },
    { $inc: incFields },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
};

const getAllActivityHistory = async (user: IAuth, date?: string) => {
  const query: FilterQuery<IActivity> = { user: user._id };
  if (date) {
    const now = new Date(date);
    const startOfDay = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    query.date = startOfDay;
  }
  return await ActivityModel.find(query).sort({ date: -1 });
};

// const getActivityHistoryByDateRange = async (
//   user: IAuth,
//   query: Record<string, unknown>
// ) => {
//   if (!query?.from || !query?.end) {
//     throw new AppError(status.BAD_REQUEST, 'From and End date are required');
//   }

//   const from = new Date(query.from as string);
//   const end = new Date(query.end as string);

//   if (isNaN(from.getTime()) || isNaN(end.getTime())) {
//     throw new AppError(status.BAD_REQUEST, 'Invalid date format');
//   }

//   const fromDate = new Date(
//     Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate())
//   );
//   const endDate = new Date(
//     Date.UTC(
//       end.getUTCFullYear(),
//       end.getUTCMonth(),
//       end.getUTCDate(),
//       23,
//       59,
//       59
//     )
//   );

//   // MongoDB filter query
//   const mongoQuery: FilterQuery<IActivity> = {
//     user: user._id,
//     date: {
//       $gte: fromDate,
//       $lte: endDate,
//     },
//   };

//   // Perform aggregation to group by date and sum values
//   const activities = await ActivityModel.aggregate([
//     {
//       $match: mongoQuery,
//     },
//     {
//       $group: {
//         _id: {
//           $dateToString: { format: '%Y-%m-%d', date: '$date' },
//         },
//         totalSteps: { $sum: '$step' },
//         totalWater: { $sum: '$water' },
//         totalCalories: { $sum: '$calories' },
//         activities: { $push: '$$ROOT' }, // Push the entire activity document for later use
//       },
//     },
//     {
//       $sort: { _id: 1 },
//     },
//   ]);

//   // Create the response structure
//   const result = {
//     user: user._id,
//     calculation: {
//       totalStep: activities.reduce((acc, curr) => acc + curr.totalSteps, 0),
//       totalWater: activities.reduce((acc, curr) => acc + curr.totalWater, 0),
//       totalCalories: activities.reduce(
//         (acc, curr) => acc + curr.totalCalories,
//         0
//       ),
//     },
//     history: activities
//       .map((activity) => {
//         return activity.activities.map((act: any) => {
//           // Get the day name from the date
//           const dayName = new Intl.DateTimeFormat('en-US', {
//             weekday: 'short',
//           }).format(new Date(act.date));

//           return {
//             _id: act._id,
//             date: act.date,
//             day: dayName,
//             calories: act.calories,
//             step: act.step,
//             water: act.water,
//           };
//         });
//       })
//       .flat(),
//   };

//   return result;
// };

const getActivityHistoryByDateRange = async (
  user: IAuth,
  query: Record<string, unknown>
) => {
  let fromDate: Date;
  let endDate: Date;

  // If 'week' param is passed, set range to the past 7 days starting on Friday
  if (query.week) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

 
    // Find the previous Friday (assuming today is in the same week)
    const dayOfWeek = today.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
    const daysToSubtract = 7 - dayOfWeek; // Calculate how many days back to Friday
    const friday = new Date(today);
    friday.setUTCDate(today.getUTCDate() - dayOfWeek);
    console.log(friday)

    fromDate = new Date(friday); // Friday
    endDate = new Date(friday);
    endDate.setUTCDate(friday.getUTCDate() + 7); // 6 days before Friday (last week's Friday)
    console.log('fromDate:', fromDate)
    console.log("enddate: ", endDate)
    // let startDate = Date.now()
    // let currentMin = new Date().getMinutes()
    // let currentHour = new Date().getHours()
    // console.log(dayOfWeek)
    // let startDayOfCurrentWeek = new Date(Date.now() - ((currentMin*60)+(currentHour * 60 * 60) + (dayOfWeek * 12 * 60 * 60))* 1000)
    // let endDayOfCurrentWeek = new Date(Date.now() + ( ((7-dayOfWeek) * 12 * 60 * 60)* 1000))
    // console.log(startDayOfCurrentWeek)
    // console.log(endDayOfCurrentWeek)
  } else {
    // Ensure from and end are provided
    if (!query?.from || !query?.end) {
      throw new AppError(status.BAD_REQUEST, 'From and End date are required');
    }

    const from = new Date(query.from as string);
    const end = new Date(query.end as string);

    if (isNaN(from.getTime()) || isNaN(end.getTime())) {
      throw new AppError(status.BAD_REQUEST, 'Invalid date format');
    }

    fromDate = new Date(
      Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate())
    );
    endDate = new Date(
      Date.UTC(
        end.getUTCFullYear(),
        end.getUTCMonth(),
        end.getUTCDate(),
        23,
        59,
        59
      )
    );
  }

  const mongoQuery: FilterQuery<IActivity> = {
    user: user._id,
    date: {
      $gte: fromDate,
      $lte: endDate,
    },
  };

  const activities = await ActivityModel.aggregate([
    {
      $match: mongoQuery,
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$date' },
        },
        totalSteps: { $sum: '$step' },
        totalWater: { $sum: '$water' },
        totalCalories: { $sum: '$calories' },
        activities: { $push: '$$ROOT' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const activityMap = new Map<string, any>();

  activities.forEach((group) => {
    group.activities.forEach((act: any) => {
      const dateKey = new Date(act.date).toISOString().split('T')[0];
      activityMap.set(dateKey, {
        _id: act._id,
        date: act.date,
        day: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(
          new Date(act.date)
        ),
        calories: act.calories,
        step: act.step,
        water: act.water,
      });
    });
  });

  const history: any[] = [];
  const current = new Date(fromDate);

  while (current <= endDate) {
    const dateKey = current.toISOString().split('T')[0];
    if (activityMap.has(dateKey)) {
      history.push(activityMap.get(dateKey));
    } else {
      history.push({
        _id: null,
        date: new Date(current),
        day: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(
          current
        ),
        calories: 0,
        step: 0,
        water: 0,
      });
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }

  // Reorganize the history to start with Friday and order accordingly
  const daysOfWeek = ['Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
  const sortedHistory: any = [];
  daysOfWeek.forEach((day) => {
    const dayHistory = history.filter((item) => item.day === day);
    sortedHistory.push(...dayHistory);
  });

  const calculation = sortedHistory.reduce(
    (acc: any, curr: any) => {
      acc.totalStep += curr.step;
      acc.totalWater += curr.water;
      acc.totalCalories += curr.calories;
      return acc;
    },
    { totalStep: 0, totalWater: 0, totalCalories: 0 }
  );

  return {
    user: user._id,
    calculation,
    history: sortedHistory,
  };
};

export const ActivityService = {
  createActivity,
  getActivitiesForToday,
  updateActivity,
  getAllActivityHistory,
  getActivityHistoryByDateRange,
};
