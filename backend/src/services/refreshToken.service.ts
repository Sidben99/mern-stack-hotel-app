import ApiError from "../../../shared/utils/ApiError";
import { getEnv } from "../conf/env.conf";
import { createToken, verifyToken } from "../helpers/createVerifyToken";
import { UserModel } from "../models/User.model";
import { RefreshTokenPayload } from "../types/types";
import { ERROR_CODES } from "../../../shared/consts/errorCodes";
import { UserResponseType } from "../../../shared/schemes/user/userResponseSchema";
export default async function refreshTokenService(refreshToken: string) {
  const envs = getEnv();
  const payload = verifyToken<RefreshTokenPayload>(
    refreshToken,
    envs.REFRESH_TOKEN_SECRET,
    "refresh",
  );
  const user = await UserModel.findById(payload.sub);
  if (!user) throw new ApiError(404, "user not found", ERROR_CODES.NOT_FOUND);
  const refreshTokenExist = user.tokens.some(
    (token) => token._id!.toString() === payload.tokenId,
  );
  if (!refreshTokenExist)
    throw new ApiError(401, "unauthorized user", ERROR_CODES.UNAUTHORIZED);
  const accessToken = createToken(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    envs.ACCESS_TOKEN_SECRET,
    envs.ACCESS_TOKEN_LIFETIME,
  );
  const userResponseDto: UserResponseType = {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };

  return { user: userResponseDto, accessToken };
}
