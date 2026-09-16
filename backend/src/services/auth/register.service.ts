import mongoose from "mongoose";
import { UserModel } from "@/models/User.model";
import { RegisterType } from "@lankaStay/shared/schemes/auth/registerSchema";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import { hashPassword } from "@/helpers/hashComparePassword";
import { createToken } from "@/helpers/createVerifyToken";
import { getEnv } from "@/conf/env.conf";
import hashStr from "@/helpers/createHash";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema";
import { ROLES } from "@lankaStay/shared/consts/roles";
export default async function registerService(userInfo: RegisterType) {
  const envs = getEnv();
  const { email, password } = userInfo;
  // check if email already exists
  const existingEmail = await UserModel.findOne({ email });
  if (existingEmail)
    throw new ApiError(
      409,
      "email already exists",
      ERROR_CODES.EMAIL_ALREADY_EXISTS,
    );
  const userId = new mongoose.Types.ObjectId();
  const refreshTokenId = new mongoose.Types.ObjectId();
  // create access and refresh token
  const accessToken = createToken(
    {
      sub: userId.toString(),
      role: ROLES.USER,
    },
    envs.ACCESS_TOKEN_SECRET,
    envs.ACCESS_TOKEN_LIFETIME,
  );
  const refreshToken = createToken(
    {
      sub: userId.toString(),
      tokenId: refreshTokenId.toString(),
    },
    envs.REFRESH_TOKEN_SECRET,
    envs.REFRESH_TOKEN_LIFETIME,
  );
  const hashedRefreshToken = hashStr(refreshToken);

  // hash password
  const hashedPassword = await hashPassword(password);
  const newUser = await UserModel.create({
    _id: userId,
    ...userInfo,
    password: hashedPassword,
    tokens: [
      {
        _id: refreshTokenId,
        token: hashedRefreshToken,
        expiresAt: new Date(Date.now() + envs.REFRESH_TOKEN_LIFETIME * 1000),
      },
    ],
  });

  const user: UserResponseType = {
    id: newUser._id.toString(),
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    avatar: newUser.avatar,
    nationality: newUser.nationality,
    phoneNumber: newUser.phoneNumber,
    ownerInfo: newUser.ownerInfo
      ? {
          firstName: newUser.ownerInfo.firstName,
          lastName: newUser.ownerInfo.lastName,
          nationalNumber: newUser.ownerInfo.nationalNumber,
          dateOfBirth: newUser.ownerInfo.dateOfBirth,
          address: newUser.ownerInfo.address,
          cardImgInfo: { img_url: newUser.ownerInfo.cardImgInfo.img_url },
          applicationStatus: newUser.ownerInfo.applicationStatus,
          rejectionNote: newUser.ownerInfo.rejectionNote,
          adminReviewedAt: newUser.ownerInfo.adminReviewedAt,
          payoutsEnabled: newUser.ownerInfo.payoutsEnabled,
        }
      : undefined,
  };
  return { user, accessToken, refreshToken };
}
