import mongoose from "mongoose";
import { UserModel } from "../models/User.model";
import { RegisterType } from "@lankaStay/shared/schemes/user/registerSchema.ts";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import { hashPassword } from "../helpers/hashComparePassword";
import { createToken } from "../helpers/createVerifyToken";
import { getEnv } from "../conf/env.conf.ts";
import hashStr from "../helpers/createHash.ts";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema.ts";
export default async function registerService(userInfo: RegisterType) {
  const envs = getEnv();
  const { firstName, lastName, email, password } = userInfo;
  // check if email already exists
  const existingEmail = await UserModel.findOne({ email });
  if (existingEmail)
    throw new ApiError(
      409,
      "email already exists",
      ERROR_CODES.EMAIL_ALREADY_EXISTS,
    );
  // hash password
  const hashedPassword = await hashPassword(password);
  const newUser = await UserModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  // create access and refresh token
  const accessToken = createToken(
    {
      sub: newUser._id.toString(),
      role: newUser.role,
    },
    envs.ACCESS_TOKEN_SECRET,
    envs.ACCESS_TOKEN_LIFETIME,
  );
  const refreshTokenId = new mongoose.Types.ObjectId();
  const refreshToken = createToken(
    {
      sub: newUser._id.toString(),
      role: newUser.role,
      tokenId: refreshTokenId.toString(),
    },
    envs.REFRESH_TOKEN_SECRET,
    envs.REFRESH_TOKEN_LIFETIME,
  );
  // add refresh token to user
  const hashedRefreshToken = hashStr(refreshToken);
  newUser.tokens.push({
    _id: refreshTokenId,
    token: hashedRefreshToken,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + envs.REFRESH_TOKEN_LIFETIME),
  });
  // save user
  await newUser.save();
  const userResponseDto: UserResponseType = {
    id: newUser._id.toString(),
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    role: newUser.role,
    avatar: newUser.avatar,
  };
  return { user: userResponseDto, accessToken, refreshToken };
}
