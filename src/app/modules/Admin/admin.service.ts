import QueryBuilder from '../../builders/QueryBuilder';
import Auth from '../Auth/auth.model'; // adjust path if needed
import { subDays } from 'date-fns';

const fetchAdminStats = async () => {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);

  // Total users
  const totalUsersPromise = Auth.countDocuments();

  // New users: created within last 30 days
  const newUsersPromise = Auth.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // Active users: not blocked
  const activeUsersPromise = Auth.countDocuments({
    isBlocked: false,
  });

  // Old users: created before last 30 days
  const oldUsersPromise = Auth.countDocuments({
    createdAt: { $lt: thirtyDaysAgo },
  });

  // Recent 3 users: sorted by creation date descending
  const recentUsersPromise = Auth.find({})
    .sort({ createdAt: -1 })
    .limit(3)
    .select('fullName email role createdAt isBlocked');

  // Await all in parallel
  const [totalUsers, newUsers, activeUsers, oldUsers, recentUsers] =
    await Promise.all([
      totalUsersPromise,
      newUsersPromise,
      activeUsersPromise,
      oldUsersPromise,
      recentUsersPromise,
    ]);

  return {
    totalUsers,
    newUsers,
    activeUsers,
    oldUsers,
    recentUsers,
  };
};

const blockUser = async (userId: string, block: boolean) => {
  const user = await Auth.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.isBlocked = block;
  await user.save();

  return user;
};

const getUserById = async (userId: string) => {
  const user = await Auth.findById(userId).select(
    '-password -refreshToken -otp -otpExpiry'
  );

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(Auth.find(), query)
    .search(['fullName'])
    .fields()
    .filter()
    .sort()
    .paginate();

  const data = await userQuery.modelQuery;

  const meta = await userQuery.countTotal();

  return { data, meta };
};

export const AdminService = {
  fetchAdminStats,
  blockUser,
  getUserById,
  getAllUsersFromDB,
};
