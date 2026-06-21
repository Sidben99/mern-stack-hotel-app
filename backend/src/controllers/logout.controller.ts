import { Request, Response } from "express";
import logoutService from "../services/logout.service.ts";
import { successMessageResponse } from "../helpers/apiResponses";
import ApiError from "../../../shared/utils/ApiError.ts";
import { ERROR_CODES } from "../../../shared/consts/errorCodes.ts";
export default async function logoutController(req: Request, res: Response) {
  res.clearCookie("refreshToken");
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await logoutService(refreshToken);
  }
  return successMessageResponse(res, 200, "logged out successfully");
}
