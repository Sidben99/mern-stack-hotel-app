import { Router } from "express";
import registerController from "@/controllers/auth/register.controller";
import validationMiddleware from "@/middlewares/validation.middleware";
import { registerSchema } from "@lankaStay/shared/schemes/user/registerSchema";
import { loginSchema } from "@lankaStay/shared/schemes/user/loginSchema";
import loginController from "@/controllers/auth/login.controller";
import refreshTokenController from "@/controllers/auth/refreshToken.controller";
import { forgetPasswordSchema } from "@lankaStay/shared/schemes/user/forgetPasswordSchema";
import forgetPasswordController from "@/controllers/auth/forgetPassword.controller";
import {
  resetPasswordDataSchema,
  resetPasswordTokenSchema,
} from "@lankaStay/shared/schemes/user/resetPasswordSchema";
import resetPasswordController from "@/controllers/auth/resetPassword.controller";
import logoutController from "@/controllers/auth/logout.controller";
export const authRouter = Router();
/**
 * BODY:   { email: string, password: string }
 * SUCCESS:  200  { message, data: { accessToken, user } }  + httpOnly refreshToken cookie
 * ERRORS:  400  VALIDATION_ERROR  /  404  NOT_FOUND  /  400  INVALID_CREDENTIALS
 */
authRouter.route("/login").post(
  validationMiddleware({
    body: loginSchema,
  }),
  loginController,
);
/**
 * BODY:   { username, email, password, confirmPassword }
 * SUCCESS:  201  { message, data: { accessToken, user } }  + httpOnly refreshToken cookie
 * ERRORS:  400  VALIDATION_ERROR  /  409  EMAIL_ALREADY_EXISTS
 */
authRouter.route("/register").post(
  validationMiddleware({
    body: registerSchema,
  }),
  registerController,
);
/**
 * COOKIE: refreshToken (httpOnly)
 * SUCCESS:  201  { message, data: { accessToken } }
 * ERRORS:  401  UNAUTHORIZED  /  401  INVALID_TOKEN  /  404  NOT_FOUND
 */
authRouter.route("/refresh-token").post(refreshTokenController);
/**
 * BODY:   { email: string }
 * SUCCESS:  200  { message }
 * ERRORS:  400  VALIDATION_ERROR  /  404  NOT_FOUND
 */
authRouter.route("/forget-password").post(
  validationMiddleware({
    body: forgetPasswordSchema,
  }),
  forgetPasswordController,
);
/**
 * QUERY:  { token: string }
 * BODY:   { password: string }
 * SUCCESS:  200  { message }
 * ERRORS:  400  VALIDATION_ERROR  /  400  INVALID_TOKEN  /  401  INVALID_TOKEN (expired)
 */
authRouter.route("/reset-password").post(
  validationMiddleware({
    query: resetPasswordTokenSchema,
    body: resetPasswordDataSchema,
  }),
  resetPasswordController,
);
/**
 * COOKIE: refreshToken (httpOnly)
 * SUCCESS:  200  { message }  + clears refreshToken cookie
 * ERRORS:  401  UNAUTHORIZED
 */
authRouter.route("/logout").post(logoutController);
