import { AppResponse, asyncHandler } from '../../utils';
import status from 'http-status';
import { TermsService } from './terms.service';

const saveTerms = asyncHandler(async (req, res) => {
  const content = req.body.content;

  const result = await TermsService.saveTermsIntoDB(content);
  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result,
        'Terms and Conditions saved successfully'
      )
    );
});

const getTerms = asyncHandler(async (req, res) => {
  const result = await TermsService.fetchTermsFromDB();

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Terms retrived successfully'));
});

export const TermsController = { saveTerms, getTerms };
