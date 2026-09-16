import mongoose from "mongoose";
import { UserModel } from "@/models/User.model";
import { LoginType } from "@lankaStay/shared/schemes/auth/loginSchema";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import { comparePassword } from "@/helpers/hashComparePassword";
import { createToken } from "@/helpers/createVerifyToken";
import { getEnv } from "@/conf/env.conf";
import hashStr from "@/helpers/createHash";
import { AccessTokenPayload, RefreshTokenPayload } from "@/types/types";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema";
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
    expiresAt: new Date(Date.now() + envs.REFRESH_TOKEN_LIFETIME * 1000),
  });
  // save user
  await user.save();

  const userResponseDto: UserResponseType = {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    nationality: user.nationality,
    phoneNumber: user.phoneNumber,
    ownerInfo: user.ownerInfo
      ? {
          firstName: user.ownerInfo.firstName,
          lastName: user.ownerInfo.lastName,
          nationalNumber: user.ownerInfo.nationalNumber,
          dateOfBirth: user.ownerInfo.dateOfBirth,
          address: user.ownerInfo.address,
          cardImgInfo: { img_url: user.ownerInfo.cardImgInfo.img_url },
          applicationStatus: user.ownerInfo.applicationStatus,
          rejectionNote: user.ownerInfo.rejectionNote,
          adminReviewedAt: user.ownerInfo.adminReviewedAt,
          payoutsEnabled: user.ownerInfo.payoutsEnabled,
        }
      : undefined,
  };

  return { user: userResponseDto, accessToken, refreshToken };
}
