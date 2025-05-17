import mongoose from 'mongoose';

const policyModel = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});

const Policy = mongoose.model('Policy', policyModel);

export default Policy;
