import { verifyToken } from "../helpers/createVerifyToken";
import { getEnv } from "../conf/env.conf";
import { UserModel } from "../models/User.model";
import { hashPassword } from "../helpers/hashComparePassword";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import ApiError from "@lankaStay/shared/utils/ApiError";
import type { AccessTokenPayload } from "../types/types";
export default async function resetPasswordService(
  token: string,
  newPassword: string,
) {
  const envs = getEnv();
  const { sub } = verifyToken<AccessTokenPayload>(
    token,
    envs.ACCESS_TOKEN_SECRET,
    "regular",
  );
  console.log("access token : ", token);
  console.log("sub  : ", sub);
  const user = await UserModel.findById(sub);
  if (!user) throw new ApiError(404, "user not found", ERROR_CODES.NOT_FOUND);
  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  user.tokens = [];
  await user.save();
  return;
}
