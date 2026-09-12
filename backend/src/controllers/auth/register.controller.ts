import { Request, Response } from "express";
import { RegisterType } from "@lankaStay/shared/schemes/user/registerSchema";
import { successDataResponse } from "@/helpers/apiResponses";
import registerService from "@/services/auth/register.service";
import { getEnv } from "@/conf/env.conf";
import { AccountResponseType } from "@lankaStay/shared/schemes/account/accountResponseSchema";
export default async function registerController(
  req: Request<any, any, RegisterType, any>,
  res: Response,
) {
  const envs = getEnv();
  const { accessToken, refreshToken, user } = await registerService(req.body);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    // path: "/api/auth/refresh-token",
    maxAge: envs.REFRESH_TOKEN_LIFETIME * 1000,
  });
  return successDataResponse<{
    accessToken: string;
    user: AccountResponseType;
  }>(res, 201, "User registered successfully", {
    accessToken,
    user,
  });
}
