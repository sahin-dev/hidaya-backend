import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { CategoryService } from './category.service';

const createCategory = asyncHandler(async (req, res) => {
  const category = await CategoryService.createCategory(req.body, req.file);

  res
    .status(status.CREATED)
    .json(
      new AppResponse(status.CREATED, category, 'Category created successfully')
    );
});

const getCategory = asyncHandler(async (req, res) => {
  const category = await CategoryService.getCategoryById(req.params.id);

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, category, 'Category fetched successfully')
    );
});

const getAllCategories = asyncHandler(async (_req, res) => {
  const categories = await CategoryService.getAllCategories();

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, categories, 'Categories fetched successfully')
    );
});

const updateCategory = asyncHandler(async (req, res) => {
  const updatedCategory = await CategoryService.updateCategory(
    req.params.id,
    req.body,
    req.file
  );

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        updatedCategory,
        'Category updated successfully'
      )
    );
});

const deleteCategory = asyncHandler(async (req, res) => {
  await CategoryService.deleteCategory(req.params.id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, null, 'Category deleted successfully'));
});

export const CategoryController = {
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
