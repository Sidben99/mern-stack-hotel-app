import { Request, Response } from "express";
import {
  ResetPasswordTokenType,
  ResetPasswordDataType,
} from "@lankaStay/shared/schemes/user/resetPasswordSchema";
import resetPasswordResetService from "../services/resetPassword.service";
import { successMessageResponse } from "../helpers/apiResponses";
export default async function resetPasswordController(
  req: Request<any, any, ResetPasswordDataType, any>,
  res: Response,
) {
  console.log("req.body : ", req.body, " req.query : ", req.query);
  const { token } = res.locals.validatedQuery as ResetPasswordTokenType;
  const { password } = req.body;
  await resetPasswordResetService(token, password);
  return successMessageResponse(res, 200, "password reset successfully");
}
