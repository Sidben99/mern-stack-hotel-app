import { Request, Response } from "express";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import ApiError from "@lankaStay/shared/utils/ApiError";
import refreshTokenService from "../services/refreshToken.service";
import { successDataResponse } from "../helpers/apiResponses";
export default async function refreshTokenController(
  req: Request,
  res: Response,
) {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken)
    throw new ApiError(401, "unauthorized user", ERROR_CODES.UNAUTHORIZED);
  const { accessToken, user } = await refreshTokenService(refreshToken);
  return successDataResponse(res, 201, "token refreshed successfully", {
    accessToken,
    user,
  });
}
