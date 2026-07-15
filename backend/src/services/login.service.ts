import mongoose from "mongoose";
import { UserModel } from "../models/User.model";
import { LoginType } from "@lankaStay/shared/schemes/user/loginSchema.ts";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import { comparePassword } from "../helpers/hashComparePassword";
import { createToken } from "../helpers/createVerifyToken";
import { getEnv } from "../conf/env.conf";
import hashStr from "../helpers/createHash";
import { AccessTokenPayload, RefreshTokenPayload } from "../types/types";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema.ts";
export default async function loginService(credentials: LoginType) {
  const envs = getEnv();
  const { email, password } = credentials;
  const user = await UserModel.findOne({
    email,
  });
  // check if user exists
  if (!user)
    throw new ApiError(
      401,
      "invalid credentials",
      ERROR_CODES.INVALID_CREDENTIALS,
    );
  // check if password is correct
  const passwordsMatch = await comparePassword(password, user.password);
  if (!passwordsMatch)
    throw new ApiError(
      401,
      "invalid credentials",
      ERROR_CODES.INVALID_CREDENTIALS,
    );
  // create access and refresh token
  const accessToken = createToken<AccessTokenPayload>(
    {
      sub: user.id,
      role: user.role,
    },
    envs.ACCESS_TOKEN_SECRET,
    envs.ACCESS_TOKEN_LIFETIME,
  );
  const refreshTokenId = new mongoose.Types.ObjectId();
  const refreshToken = createToken<RefreshTokenPayload>(
    {
      sub: user.id,
      role: user.role,
      tokenId: refreshTokenId.toString(),
    },
    envs.REFRESH_TOKEN_SECRET,
    envs.REFRESH_TOKEN_LIFETIME,
  );
  // add refresh token to user
  const hashedRefreshToken = hashStr(refreshToken);
  user.tokens.push({
    _id: refreshTokenId,
    token: hashedRefreshToken,
    expiresAt: new Date(Date.now() + envs.REFRESH_TOKEN_LIFETIME),
    createdAt: new Date(),
  });
  // save user
  await user.save();
  const userResponseDto: UserResponseType = {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };
  return { user: userResponseDto, accessToken, refreshToken };
}
