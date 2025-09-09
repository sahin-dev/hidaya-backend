import { Router } from 'express';
import { auth } from '../../middlewares';
import { AdminController } from './admin.controller';
import { ROLE } from '../Auth/auth.constant';
import { upload } from '../../lib';

const router = Router();

router.get(
  '/stats',
  auth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  AdminController.getAdminStats
);

router.patch(
  '/block/:id',
  auth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  AdminController.blockUser
);

router.get(
  '/user/:id',
  auth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  AdminController.getUserById
);

router.get(
  '/users',
  auth(ROLE.SUPER_ADMIN, ROLE.ADMIN),
  AdminController.getAllUsers
);

router.put("/profile", auth(ROLE.ADMIN, ROLE.SUPER_ADMIN),upload.single('file'), AdminController.updateAdminProfile)

export const AdminRoutes = router;
