import { z } from 'zod';
import { PROVIDER } from './auth.constant';

const createSchema = z.object({
  body: z
    .object({
      fullName: z
        .string({
          required_error: 'Full name is required',
        })
        .min(3, { message: 'Full name must be at least 3 characters long' })
        .max(30, { message: 'Full name cannot exceed 30 characters' })
        .regex(/^[a-zA-Z\s]+$/, {
          message: 'Full name can only contain letters and spaces',
        }),
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email({ message: 'Invalid email format' }),
      password: z
        .string({
          required_error: 'Password is required',
        })
        .min(6, { message: 'Password must be at least 6 characters long' })
        .max(20, { message: 'Password cannot exceed 20 characters' })
        .regex(/[A-Z]/, {
          message: 'Password must contain at least one uppercase letter',
        })
        .regex(/[a-z]/, {
          message: 'Password must contain at least one lowercase letter',
        })
        .regex(/[0-9]/, {
          message: 'Password must contain at least one number',
        })
        .regex(/[@$!%*?&#]/, {
          message: 'Password must contain at least one special character',
        }),
    })
    .strict(),
});

const verifyOtpSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' }),
    otp: z
      .string({
        required_error: 'OTP is required',
      })
      .regex(/^\d+$/, { message: 'OTP must be a number' })
      .length(6, { message: 'OTP must be exactly 6 digits' }),
  }),
});

const emailSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' }),
  }),
});

const socialSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Invalid email address')
      .nonempty('Email is required'),
    fcmToken: z.string().nonempty('FCM Token is required'),
    provider: z.enum([PROVIDER.GOOGLE, PROVIDER.FACEBOOK, PROVIDER.APPLE], {
      message: 'Provider must be one of: GOOGLE, FACEBOOK, or APPLE.',
    }),

    image: z.string().url('Image URL must be a valid URL').optional(),
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
  }),
});

const updateSchema = z.object({
  body: z
    .object(createSchema.shape.body.shape)
    .omit({ email: true, password: true })
    .partial()
    .extend({
      address: z.string().optional(),
      phoneNumber: z.string().optional(),
    })
    .strict(),
});

const forgetPasswordVerifySchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' }),
    otp: z
      .string({
        required_error: 'OTP is required',
      })
      .regex(/^\d+$/, { message: 'OTP must be a number' })
      .length(6, { message: 'OTP must be exactly 6 digits' }),
  }),
});

const resetPasswordSchema = z.object({
  body: z.object({
    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(6, { message: 'New password must be at least 6 characters long' })
      .max(20, { message: 'New password cannot exceed 20 characters' })
      .regex(/[A-Z]/, {
        message: 'New password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'New password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, {
        message: 'New password must contain at least one number',
      })
      .regex(/[@$!%*?&#]/, {
        message: 'New password must contain at least one special character',
      }),
  }),
});

const signinSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({ message: 'Invalid email format' }),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(20, { message: 'Password cannot exceed 20 characters' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[@$!%*?&#]/, {
        message: 'Password must contain at least one special character',
      }),
  }),
});

const passwordChangeSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({
        required_error: 'Old password is required',
      })
      .min(6, { message: 'Old password must be at least 6 characters long' })
      .max(20, { message: 'Old password cannot exceed 20 characters' })
      .regex(/[A-Z]/, {
        message: 'Old password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Old password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[@$!%*?&#]/, {
        message: 'Old password must contain at least one special character',
      }),
    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(6, { message: 'New password must be at least 6 characters long' })
      .max(20, { message: 'New password cannot exceed 20 characters' })
      .regex(/[A-Z]/, {
        message: 'New password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'New password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[@$!%*?&#]/, {
        message: 'New password must contain at least one special character',
      }),
  }),
});



const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const accessTokenSchema = z.object({
  cookies: z.object({
    accessToken: z.string({
      required_error: 'Access token is required!',
    }),
  }),
});

export type TRegisterPayload = z.infer<typeof createSchema.shape.body>;
export type TOtpPayload = z.infer<typeof verifyOtpSchema.shape.body>;
export type TUpdatePayload = z.infer<typeof updateSchema.shape.body>;

export const AuthValidation = {
  createSchema,
  verifyOtpSchema,
  emailSchema,
  signinSchema,
  socialSchema,
  updateSchema,
  passwordChangeSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  accessTokenSchema,
  forgetPasswordVerifySchema,
};
