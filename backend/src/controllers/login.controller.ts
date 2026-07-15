import { Request, Response } from "express";
import { LoginType } from "@lankaStay/shared/schemes/user/loginSchema.ts";
import { successDataResponse } from "../helpers/apiResponses";
import { getEnv } from "../conf/env.conf";
import loginService from "../services/login.service";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema";
export default async function loginController(
  req: Request<any, any, LoginType, any>,
  res: Response,
) {
  const envs = getEnv();
  const { user, accessToken, refreshToken } = await loginService(req.body);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    // path: "/api/auth/refresh-token",
    maxAge: envs.REFRESH_TOKEN_LIFETIME * 1000,
    sameSite: "lax",
  });
  return successDataResponse<{
    accessToken: string;
    user: UserResponseType;
  }>(res, 200, "User logged in successfully", {
    accessToken,
    user,
  });
}
