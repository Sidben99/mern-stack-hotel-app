import { verifyToken } from "../helpers/createVerifyToken";
import { UserModel } from "../models/User.model";
import { getEnv } from "../conf/env.conf";
import { RefreshTokenPayload } from "../types/types";
import ApiError from "../../../shared/utils/ApiError";
import { ERROR_CODES } from "../../../shared/consts/errorCodes";
export default async function logoutService(refreshToken: string) {
  const envs = getEnv();
  // Verify refresh token
  const payload = verifyToken<RefreshTokenPayload>(
    refreshToken,
    envs.REFRESH_TOKEN_SECRET,
  );
  // Delete refresh token
  const updatedUser = await UserModel.findByIdAndUpdate(
    payload.sub,
    { $pull: { tokens: { _id: payload.tokenId } } },
    { new: true },
  );

  if (!updatedUser) {
    throw new ApiError(404, "user not found", ERROR_CODES.NOT_FOUND);
  }
}
