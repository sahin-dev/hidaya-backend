import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  image?: string;
}

const categorySchema: Schema<ICategory> = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
  },
});

const Category: Model<ICategory> = mongoose.model<ICategory>(
  'Category',
  categorySchema
);

export default Category;
