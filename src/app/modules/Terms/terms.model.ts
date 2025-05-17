import mongoose from 'mongoose';

const termsModel = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
});

const Terms = mongoose.model('Terms', termsModel);

export default Terms;
