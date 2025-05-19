/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import { AppError } from '../../utils';
import Tracker from './tracker.model';
import { ITracker } from './tracker.interface';
import Category from '../Category/category.model';

const createTracker = async (payload: ITracker) => {
  const category = await Category.findById(payload.category);

  if (!category) {
    throw new AppError(status.NOT_FOUND, 'Category not exists!');
  }

  const tracker = await Tracker.create(payload);

  if (!tracker) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to create tracker entry'
    );
  }

  return tracker;
};

const getTrackerById = async (id: string) => {
  const tracker = await Tracker.findById(id).populate('category');

  if (!tracker) {
    throw new AppError(status.NOT_FOUND, 'Tracker entry not found');
  }

  return tracker;
};

const getAllTrackers = async () => {
  return await Tracker.find().populate('category');
};

const updateTracker = async (id: string, payload: Partial<ITracker>) => {
  const tracker = await Tracker.findById(id);

  if (!tracker) {
    throw new AppError(status.NOT_FOUND, 'Tracker entry not found');
  }

  const updatedTracker = await Tracker.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('category');

  if (!updatedTracker) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to update tracker entry'
    );
  }

  return updatedTracker;
};

const deleteTracker = async (id: string) => {
  const tracker = await Tracker.findById(id);

  if (!tracker) {
    throw new AppError(status.NOT_FOUND, 'Tracker entry not found');
  }

  await Tracker.findByIdAndDelete(id);

  return null;
};

export const TrackerService = {
  createTracker,
  getTrackerById,
  getAllTrackers,
  updateTracker,
  deleteTracker,
};
