import { Request, Response } from "express";
import logoutService from "../services/logout.service.ts";
import { successMessageResponse } from "../helpers/apiResponses";
export default async function logoutController(req: Request, res: Response) {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await logoutService(refreshToken);
  }
  res.clearCookie("refreshToken");
  return successMessageResponse(res, 200, "logged out successfully");
}
