import { AppResponse, asyncHandler } from '../../utils';
import { PolicyService } from './policy.service';
import status from 'http-status';

const savePolicy = asyncHandler(async (req, res) => {
  const content = req.body.content;

  const result = await PolicyService.savePolicyIntoDB(content);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Policy saved successfully'));
});

const getPolicy = asyncHandler(async (req, res) => {
  const result = await PolicyService.fetchPolicyFromDB();

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Policy retrived successfully'));
});

export const PolicyController = { savePolicy, getPolicy };
