import status from 'http-status';
import { AppResponse, asyncHandler, options } from '../../utils';
import { AuthService } from './auth.service';
import { CookieOptions } from 'express';

const signup = asyncHandler(async (req, res) => {
  await AuthService.saveUserIntoDB(req.body);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, null, 'OTP send successfully'));
});

const signupVerification = asyncHandler(async (req, res) => {
  const result = await AuthService.verifyOtpIntoDB(req.body);

  res
    .status(status.CREATED)
    .cookie('accessToken', result.accessToken, options as CookieOptions)
    .cookie('refreshToken', result.refreshToken, options as CookieOptions)
    .json(
      new AppResponse(status.CREATED, result, 'Account created successfully')
    );
});

const resentOtp = asyncHandler(async (req, res) => {
  const result = await AuthService.resendOtpAgain(req.body.email);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Resend otp send successfully'));
});

const signin = asyncHandler(async (req, res) => {
  const result = await AuthService.signinIntoDB(req.body);

  res
    .status(status.OK)
    .cookie('accessToken', result.accessToken, options as CookieOptions)
    .cookie('refreshToken', result.refreshToken, options as CookieOptions)
    .json(new AppResponse(status.OK, result, 'Signin successfully'));
});

const socialSignin = asyncHandler(async (req, res) => {
  const result = await AuthService.socialLoginServices(req.body);

  res
    .status(status.OK)
    .cookie('accessToken', result.accessToken, options as CookieOptions)
    .cookie('refreshToken', result.refreshToken, options as CookieOptions)
    .json(new AppResponse(status.OK, result, 'Signin successfully'));
});

const signout = asyncHandler(async (req, res) => {
  await AuthService.signoutFromDB(req.user);

  res
    .status(status.OK)
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json(new AppResponse(status.OK, null, 'Signout successfully'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const result = await AuthService.updateProfileIntoDB(
    req.user,
    req.body,
    req.file
  );

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Profile update successfully'));
});

const updateProfilePhoto = asyncHandler(async (req, res) => {
  const result = await AuthService.updateProfilePhoto(req.user, req.file);

  res
    .status(status.OK)
    .json(
      new AppResponse(status.OK, result, 'Profile photo update successfully')
    );
});

const changePassword = asyncHandler(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const result = await AuthService.changePasswordIntoDB(accessToken, req.body);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Password change successfully'));
});

// For forget password
const forgetPassword = asyncHandler(async (req, res) => {
  const email = req.body.email;

  const result = await AuthService.forgotPassword(email);

  res
    .status(status.OK)
    .json(
      new AppResponse(
        status.OK,
        result,
        'Your OTP has been successfully sent to your email.'
      )
    );
});

const verifyOtpForForgetPassword = asyncHandler(async (req, res) => {
  const result = await AuthService.verifyOtpForForgetPassword(req.body);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'OTP verified successfully'));
});

const resetPassword = asyncHandler(async (req, res) => {
  const resetToken =
    req.header('Authorization')?.replace('Bearer ', '') ||
    req.cookies?.resetPasswordToken;
  const result = await AuthService.resetPasswordIntoDB(
    resetToken,
    req.body.newPassword
  );

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Reset password successfully'));
});

export const AuthController = {
  signup,
  signupVerification,
  resentOtp,
  signin,
  socialSignin,
  signout,
  updateProfile,
  updateProfilePhoto,
  changePassword,
  forgetPassword,
  verifyOtpForForgetPassword,
  resetPassword,
};
