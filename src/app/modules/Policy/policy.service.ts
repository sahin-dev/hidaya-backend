import Policy from './policy.model';

const savePolicyIntoDB = async (content: string) => {
  const existPrivacyPolicy = await Policy.findOne();

  if (existPrivacyPolicy) {
    // If it exists, overwrite it
    existPrivacyPolicy.content = content;
    return await existPrivacyPolicy.save();
  } else {
    // If it doesn't exist, create a new one
    const newPrivacyPolicy = new Policy({ content });
    return await newPrivacyPolicy.save();
  }
};

const fetchPolicyFromDB = async () => {
  return await Policy.findOne();
};

export const PolicyService = { savePolicyIntoDB, fetchPolicyFromDB };
