import { Request, Response, NextFunction } from "express";
import { ROLES } from "@lankaStay/shared/consts/roles";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
export default function autherizeMiddleware(roles: ROLES[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const { role } = req.user;
    if (!roles.includes(role))
      throw new ApiError(403, "unauthorized user", ERROR_CODES.UNAUTHORIZED);
    next();
  };
}
