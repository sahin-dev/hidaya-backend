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
  phoneNumber: string;
  address: string;
  refreshToken: string;
  otp: string | null;
  otpExpiry: Date | null;
  notifications: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}
