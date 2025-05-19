import status from 'http-status';
import { AppError } from '../../utils';
import Hadith from './hadith.model';
import { IHadith } from './hadith.interface';

const createHadith = async (payload: IHadith) => {
  const hadith = await Hadith.create(payload);

  if (!hadith) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to create hadith');
  }

  return hadith;
};

const getHadithById = async (id: string) => {
  const hadith = await Hadith.findById(id);

  if (!hadith) {
    throw new AppError(status.NOT_FOUND, 'Hadith not found');
  }

  return hadith;
};

const getAllHadiths = async () => {
  return await Hadith.find();
};

/**
 * Get Hadiths where date matches today's date (ignoring time)
 */
const getHadithsForToday = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // start of today

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // start of tomorrow

  const hadiths = await Hadith.find({
    date: {
      $gte: today,
      $lt: tomorrow,
    },
  });

  return hadiths;
};

const updateHadith = async (id: string, payload: Partial<IHadith>) => {
  const hadith = await Hadith.findById(id);

  if (!hadith) {
    throw new AppError(status.NOT_FOUND, 'Hadith not found');
  }

  const updatedHadith = await Hadith.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!updatedHadith) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, 'Failed to update hadith');
  }

  return updatedHadith;
};

const deleteHadith = async (id: string) => {
  const hadith = await Hadith.findById(id);

  if (!hadith) {
    throw new AppError(status.NOT_FOUND, 'Hadith not found');
  }

  await Hadith.findByIdAndDelete(id);

  return null;
};

export const HadithService = {
  createHadith,
  getHadithById,
  getAllHadiths,
  getHadithsForToday,
  updateHadith,
  deleteHadith,
};
