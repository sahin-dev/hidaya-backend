import Terms from './terms.model';

const saveTermsIntoDB = async (content: string) => {
  const existTerms = await Terms.findOne();

  if (existTerms) {
    // If it exists, overwrite it
    existTerms.content = content;
    return await existTerms.save();
  } else {
    // If it doesn't exist, create a new one
    const newTerms = new Terms({ content });
    return await newTerms.save();
  }
};

const fetchTermsFromDB = async () => {
  return await Terms.findOne();
};

export const TermsService = { saveTermsIntoDB, fetchTermsFromDB };
