import { UserModel } from "../models/User.model";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { createToken } from "../helpers/createVerifyToken";
import { getEnv } from "../conf/env.conf";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import { sendEmail } from "../helpers/sendEmail";
export default async function forgetPassword(email: string) {
  const envs = getEnv();
  const user = await UserModel.findOne({ email });
  if (!user) throw new ApiError(404, "user not found", ERROR_CODES.NOT_FOUND);
  const token = createToken(
    { sub: user._id.toString() },
    envs.ACCESS_TOKEN_SECRET,
    envs.ACCESS_TOKEN_LIFETIME,
  );
  await sendEmail(
    email,
    "Reset password",
    `your reset password link is http://localhost:5173/auth/reset-password?token=${token}`,
    `this is your reset password link <a href="http://localhost:5173/auth/reset-password?token=${token}">reset password</a>`,
  );
}
