/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from 'jsonwebtoken';
import { generateOtp, verifyToken } from '../../lib';
import sendOtpSms from '../../utils/sendOtpSms';
import { IAuth } from './auth.interface';
import config from '../../config';
import { AppError, Logger, sendOtpEmail } from '../../utils';
import status from 'http-status';
import Auth from './auth.model';
import { AuthValidation } from './auth.validation';
import bcrypt from 'bcryptjs';
import { TSocialLoginPayload } from '../../types';
import fs from 'fs';
import { z } from 'zod';

const createAuth = async (payload: IAuth) => {
  const existingUser = await Auth.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(status.BAD_REQUEST, 'User already exists');
  }

  const otp = generateOtp();
  await sendOtpEmail(payload.email, otp, payload.fullName);

  const token = jwt.sign({ ...payload, otp }, config.jwt_access_secret!, {
    expiresIn: '10m',
  });

  return { token, otp };
};

const signupOtpSendAgain = async (token: string) => {
  const decoded = jwt.decode(token) as JwtPayload;

  const authData = {
    email: decoded.email,
    phoneNumber: decoded.phoneNumber,
    password: decoded.password,
  };

  const otp = generateOtp();
  await sendOtpSms(decoded.phoneNumber, otp);
  const newToken = jwt.sign({ ...authData, otp }, config.jwt_access_secret!, {
    expiresIn: '5m',
  });

  return { token: newToken, otp };
};

const saveAuthIntoDB = async (token: string, otp: number) => {
  const decoded = jwt.verify(token, config.jwt_access_secret!) as JwtPayload;

  const existingUser = await Auth.findOne({ email: decoded.email });

  if (existingUser) {
    throw new AppError(status.BAD_REQUEST, 'User already exists');
  }

  if (decoded?.otp !== otp) {
    throw new AppError(status.BAD_REQUEST, 'Invalid OTP');
  }

  const result = await Auth.create({
    fullName: decoded.fullName,
    phoneNumber: decoded.phoneNumber,
    email: decoded.email,
    password: decoded.password,
    isVerified: true,
  });

  if (!result) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Failed to save user info'
    );
  }

  const accessToken = result.generateAccessToken();
  const refreshToken = result.generateRefreshToken();

  return { accessToken, refreshToken };
};

const signinIntoDB = async (payload: { email: string; password: string }) => {
  const user = await Auth.findOne({ email: payload.email }).select('+password');

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not exists!');
  }

  if (user.isSocialLogin) {
    throw new AppError(
      status.BAD_REQUEST,
      'This account is registered via social login. Please sign in using your social account.'
    );
  }

  const isPasswordCorrect = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new AppError(status.UNAUTHORIZED, 'Invalid credentials');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    accessToken,
    refreshToken,
  };
};

const socialLoginServices = async (payload: TSocialLoginPayload) => {
  const { email, fcmToken, image, fullName, address } = payload;

  // Check if user exists
  const auth = await Auth.findOne({ email });

  if (!auth) {
    const authRes = await Auth.create({
      email,
      fcmToken,
      image,
      fullName,
      address,
      isSocialLogin: true,
      isVerified: true,
    });

    if (!authRes) {
      throw new AppError(
        status.INTERNAL_SERVER_ERROR,
        'Fail to create user into database'
      );
    }

    const accessToken = authRes.generateAccessToken();
    const refreshToken = authRes.generateRefreshToken();

    await Auth.findByIdAndUpdate(authRes._id, { refreshToken });

    return {
      response: {
        fullName: authRes.fullName,
        email: authRes.email,
        role: authRes.role,
        image: authRes.image,
      },
      accessToken,
      refreshToken,
    };
  } else {
    const accessToken = auth.generateAccessToken();
    const refreshToken = auth.generateRefreshToken();

    auth.refreshToken = refreshToken;
    await auth.save({ validateBeforeSave: false });

    return {
      response: {
        fullName: auth.fullName,
        email: auth.email,
        role: auth.role,
        image: auth.image,
      },
      accessToken,
      refreshToken,
    };
  }
};

const updateProfilePhoto = async (
  user: IAuth,
  file: Express.Multer.File | undefined
) => {
  if (!file?.path) {
    throw new AppError(status.BAD_REQUEST, 'File is required');
  }

  // Delete the previous image if exists
  if (user?.image) {
    try {
      await fs.promises.unlink(user.image);
    } catch (error: unknown) {
      Logger.error('Error deleting old file:', error);
    }
  }

  const res = await Auth.findByIdAndUpdate(
    user._id,
    { image: file.path },
    { new: true }
  ).select('fullName email image role isProfile phoneNumber');

  return res;
};

const changePasswordIntoDB = async (
  accessToken: string,
  payload: z.infer<typeof AuthValidation.passwordChangeSchema.shape.body>
) => {
  const { id } = await verifyToken(accessToken);

  const user = await Auth.findOne({ _id: id, isActive: true }).select(
    '+password'
  );

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not exists');
  }

  const isCredentialsCorrect = await bcrypt.compare(
    payload.oldPassword,
    user.password
  );

  if (!isCredentialsCorrect) {
    throw new AppError(status.UNAUTHORIZED, 'Current password is not correct');
  }

  user.password = payload.newPassword;
  await user.save();

  return null;
};

const forgotPassword = async (email: string) => {
  const user = await Auth.findOne({ email, isActive: true });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const otp = generateOtp();
  await user.save();
  await sendOtpEmail(email, otp, user.fullName || 'Guest');

  const token = jwt.sign(
    {
      email,
      verificationCode: otp,
      verificationExpiry: new Date(Date.now() + 5 * 60 * 1000),
    },
    config.jwt_access_secret!,
    {
      expiresIn: '5m',
    }
  );

  return { token };
};

const verifyOtpForForgetPassword = async (payload: {
  token: string;
  otp: string;
}) => {
  const { email, verificationCode, verificationExpiry } = (await verifyToken(
    payload.token
  )) as any;
  const user = await Auth.findOne({ email, isActive: true });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  // Check if the OTP matches
  if (verificationCode !== payload.otp || !verificationExpiry) {
    throw new AppError(status.BAD_REQUEST, 'Invalid OTP');
  }

  console.log({ verificationExpiry });

  // Check if OTP has expired
  if (Date.now() > new Date(verificationExpiry).getTime()) {
    throw new AppError(status.BAD_REQUEST, 'OTP has expired');
  }

  const resetPasswordToken = jwt.sign(
    {
      email: user.email,
      isResetPassword: true,
    },
    config.jwt_access_secret!,
    {
      expiresIn: '5d',
    }
  );

  return { resetPasswordToken };
};

const resetPasswordIntoDB = async (
  resetPasswordToken: string,
  newPassword: string
) => {
  const { email, isResetPassword } = (await verifyToken(
    resetPasswordToken
  )) as any;

  const user = await Auth.findOne({ email, isActive: true });

  if (!user) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  // Check if the OTP matches
  if (!isResetPassword) {
    throw new AppError(status.BAD_REQUEST, 'Invalid reset password token or ');
  }

  // Update the user's password
  user.password = newPassword;
  await user.save();

  return null;
};

export const AuthService = {
  createAuth,
  saveAuthIntoDB,
  signupOtpSendAgain,
  signinIntoDB,
  socialLoginServices,
  updateProfilePhoto,
  changePasswordIntoDB,
  forgotPassword,
  verifyOtpForForgetPassword,
  resetPasswordIntoDB,
};
