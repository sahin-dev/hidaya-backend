/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { PROVIDER, ROLE } from './auth.constant';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { IAuth } from './auth.interface';

const authSchema = new mongoose.Schema<IAuth>(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: false,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: 'USER',
    },
    isSocialLogin: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: Object.values(PROVIDER),
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    notifications: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Custom hooks/methods

// Modified password fields before save to database
authSchema.pre('save', async function (next) {
  try {
    // Check if the password is modified or this is a new user
    if (this.password && (this.isModified('password') || this.isNew)) {
      const hashPassword = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt_rounds)
      );
      this.password = hashPassword;
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

// For generating access token
authSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    config.jwt_access_secret!,
    {
      expiresIn: config.jwt_access_expires_in as any,
    }
  );
};

// For generating refresh token
authSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    config.jwt_refresh_secret!,
    {
      expiresIn: config.jwt_refresh_expires_in as any,
    }
  );
};

const Auth = mongoose.model<IAuth>('Auth', authSchema);

export default Auth;
