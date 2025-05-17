import { Router } from 'express';
import { auth } from '../../middlewares';
import { CategoryController } from './category.controller';
import { upload } from '../../lib';
import { ROLE } from '../Auth/auth.constant';

const router = Router();

router
  .route('/')
  .post(
    auth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
    upload.single('image'),
    CategoryController.createCategory
  )
  .get(CategoryController.getAllCategories);

router
  .route('/:id')
  .get(CategoryController.getCategory)
  .patch(
    auth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
    upload.single('image'),
    CategoryController.updateCategory
  )
  .delete(
    auth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
    CategoryController.deleteCategory
  );

export const CategoryRoutes = router;
