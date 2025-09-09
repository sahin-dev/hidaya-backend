import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { AdminService } from './admin.service';
import { AuthService } from '../Auth/auth.service';

const getAdminStats = asyncHandler(async (req, res) => {
  const stats = await AdminService.fetchAdminStats();

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, stats, 'Admin stats fetched successfully')
    );
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { block } = req.body; // expects { block: true } or { block: false }

  const updatedUser = await AdminService.blockUser(id, block);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        updatedUser,
        `User has been ${block ? 'blocked' : 'unblocked'}`
      )
    );
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await AdminService.getUserById(id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, user, 'User fetched successfully'));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const user = await AdminService.getAllUsersFromDB(req.query);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, user, 'Users retrieved successfully'));
});



const updateAdminProfile = asyncHandler(async (req, res) => {
  const result = await AuthService.updateProfileIntoDB(
    req.user,
    req.body,
    req.file
  );

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Profile update successfully'));
});
export const AdminController = {
  getAdminStats,
  blockUser,
  getUserById,
  getAllUsers,
  updateAdminProfile
};
