import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import { upload } from '../../lib';
import { validateRequestFromFormData } from '../../middlewares/validateRequest';

const router = Router();

router
  .route('/signup')
  .post(validateRequest(AuthValidation.createSchema), AuthController.signup);

router
  .route('/verify-signup-otp')
  .post(
    validateRequest(AuthValidation.verifyOtpSchema),
    AuthController.signupVerification
  );

router
  .route('/resend')
  .post(validateRequest(AuthValidation.emailSchema), AuthController.resentOtp);

router
  .route('/signin')
  .post(validateRequest(AuthValidation.signinSchema), AuthController.signin);

router
  .route('/social-signin')
  .post(
    validateRequest(AuthValidation.socialSchema),
    AuthController.socialSignin
  );

router.route('/signout').post(auth(), AuthController.signout);

router
  .route('/update-profile')
  .patch(
    auth(),
    upload.single('file'),
    validateRequestFromFormData(AuthValidation.updateSchema),
    AuthController.updateProfile
  );

router
  .route('/profile-image')
  .put(auth(), upload.single('file'), AuthController.updateProfilePhoto);

router
  .route('/change-password')
  .patch(
    auth(),
    validateRequest(AuthValidation.passwordChangeSchema),
    AuthController.changePassword
  );

// For forget password
router
  .route('/forget-password')
  .post(
    validateRequest(AuthValidation.emailSchema),
    AuthController.forgetPassword
  );

router
  .route('/forget-password-verify')
  .post(
    validateRequest(AuthValidation.forgetPasswordVerifySchema),
    AuthController.verifyOtpForForgetPassword
  );

router
  .route('/reset-password')
  .patch(
    validateRequest(AuthValidation.resetPasswordSchema),
    AuthController.resetPassword
  );

export const AuthRoutes = router;
