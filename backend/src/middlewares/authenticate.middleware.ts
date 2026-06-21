import { Request, Response, NextFunction } from "express";
import ApiError from "../../../shared/utils/ApiError";
import { ERROR_CODES } from "../../../shared/consts/errorCodes";
import { verifyToken } from "../helpers/createVerifyToken";
import { AccessTokenPayload } from "../types/types";
import { getEnv } from "../conf/env.conf";
export default function authenticateMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const envs = getEnv();
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token)
    throw new ApiError(401, "unauthorized user", ERROR_CODES.UNAUTHORIZED);
  const payload = verifyToken<AccessTokenPayload>(
    token,
    envs.ACCESS_TOKEN_SECRET,
    "access",
  );
  req.user = payload;
  next();
}
