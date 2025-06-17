import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { TrackerService } from './tracker.service';

const createTracker = asyncHandler(async (req, res) => {
  const tracker = await TrackerService.createTracker(req.body);

  res
    .status(status.CREATED)
    .json(
      new AppResponse(status.CREATED, tracker, 'Tracker entry created successfully')
    );
});

const getTracker = asyncHandler(async (req, res) => {
  const tracker = await TrackerService.getTrackerById(req.params.id);

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, tracker, 'Tracker entry fetched successfully')
    );
});

const getAllTrackers = asyncHandler(async (_req, res) => {
  const trackers = await TrackerService.getAllTrackers();

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, trackers, 'Trackers fetched successfully')
    );
});

const updateTracker = asyncHandler(async (req, res) => {
  const updatedTracker = await TrackerService.updateTracker(req.params.id, req.body);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        updatedTracker,
        'Tracker entry updated successfully'
      )
    );
});

const deleteTracker = asyncHandler(async (req, res) => {
  await TrackerService.deleteTracker(req.params.id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, null, 'Tracker entry deleted successfully'));
});

export const TrackerController = {
  createTracker,
  getTracker,
  getAllTrackers,
  updateTracker,
  deleteTracker,
};
