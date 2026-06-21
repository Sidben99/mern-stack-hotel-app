import { Request, Response } from "express";
import forgetPasswordService from "../services/forgetPassword.service.ts";
import { successMessageResponse } from "../helpers/apiResponses";
import { ForgetPassword } from "../../../shared/schemes/user/forgetPasswordSchema.ts";
export default async function forgetPasswordController(
  req: Request<any, any, ForgetPassword, any>,
  res: Response,
) {
  const { email } = req.body;
  await forgetPasswordService(email);
  return successMessageResponse(
    res,
    200,
    "password reset link sent successfully , check your email",
  );
}
