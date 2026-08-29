import { Request, Response } from "express";
import logoutService from "@/services/auth/logout.service";
import { successMessageResponse } from "@/helpers/apiResponses";
export default async function logoutController(req: Request, res: Response) {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    res.clearCookie("refreshToken");
    await logoutService(refreshToken);
  }
  return successMessageResponse(res, 200, "logged out successfully");
}
