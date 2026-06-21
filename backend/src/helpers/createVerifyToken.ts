import jwt from "jsonwebtoken";
import ApiError from "../../../shared/utils/ApiError";
import { ERROR_CODES } from "../../../shared/consts/errorCodes";
import type { TokenType } from "../types/types";
const tokenErrors: Record<
  TokenType,
  Record<"invalid" | "expired", ERROR_CODES>
> = {
  access: {
    expired: ERROR_CODES.ACCESS_TOKEN_EXPIRED,
    invalid: ERROR_CODES.INVALID_ACCESS_TOKEN,
  },
  refresh: {
    expired: ERROR_CODES.REFRESH_TOKEN_EXPIRED,
    invalid: ERROR_CODES.INVALID_REFRESH_TOKEN,
  },
  regular: {
    expired: ERROR_CODES.TOKEN_EXPIRED,
    invalid: ERROR_CODES.INVALID_TOKEN,
  },
};
export function createToken<T extends object | string>(
  payload: T,
  secret: string,
  expiresIn: number,
) {
  return jwt.sign(payload, secret, { expiresIn });
}
export function verifyToken<T>(
  token: string,
  secret: string,
  tokenType: TokenType,
) {
  try {
    const payload = jwt.verify(token, secret) as T;
    return payload;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "token expired", tokenErrors[tokenType].expired);
    }
    if (err.name === "JsonWebTokenError") {
      throw new ApiError(401, "invalid token", tokenErrors[tokenType].invalid);
    }
    throw err;
  }
}
