import { Document } from 'mongoose';
import { TProvider, TRole } from './auth.constant';

export interface IAuth extends Document {
  fullName: string;
  email: string;
  password: string;
  role: TRole;
  image?: string;
  isSocialLogin: boolean;
  provider: TProvider;
  refreshToken: string;
  otp: string;
  otpExpiry: Date;
  notifications: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}
