/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import status from 'http-status';
import { AppError, Logger } from '../../utils';
import Category from './category.model';
import { ICategory } from './category.interface';
import config from '../../config';

const createCategory = async (
  payload: ICategory,
  file: Express.Multer.File | undefined
) => {
  if (!file) {
    throw new AppError(status.BAD_REQUEST, 'Category image is required');
  }

  const existingCategory = await Category.findOne({ name: payload.name });

  if (existingCategory) {
    throw new AppError(status.BAD_REQUEST, 'Category already exists');
  }
  let resolvedPath = file.path.replace(/\\/g, "/")
  console.log(resolvedPath)
  let url = `${config.backend_url}/${resolvedPath}`

  payload.image = url;

  const category = await Category.create(payload);

  if (!category) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to create category'
    );
  }

  return category;
};

const getCategoryById = async (id: string) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(status.NOT_FOUND, 'Category not found');
  }

  return category;
};

const getAllCategories = async () => {
  return await Category.find();
};

const updateCategory = async (
  id: string,
  payload: Partial<ICategory>,
  file: Express.Multer.File | undefined
) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(status.NOT_FOUND, 'Category not found');
  }
  payload.name = category.name

  if (file?.path) {
    if (category.image) {
      try {
        await fs.promises.unlink(category.image);
      } catch (error: unknown) {
        Logger.error('Error deleting old image:', error);
      }
    }
    let resolvedPath = file.path.replace(/\\/g, "/")
    let url = `${config.backend_url}/${resolvedPath}`
    payload.image = url;
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!updatedCategory) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to update category'
    );
  }

  return updatedCategory;
};

const deleteCategory = async (id: string) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(status.NOT_FOUND, 'Category not found');
  }

  if (category.image) {
    try {
      await fs.promises.unlink(category.image);
    } catch (error: unknown) {
      Logger.error('Error deleting image:', error);
    }
  }

  await Category.findByIdAndDelete(id);

  return null;
};

export const CategoryService = {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
