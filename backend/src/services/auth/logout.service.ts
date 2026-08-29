import { getEnv } from "@/conf/env.conf";
import { UserModel } from "@/models/User.model";
import { RefreshTokenPayload } from "@/types/types";
import jwt from "jsonwebtoken";
export default async function logoutService(refreshToken: string) {
  const envs = getEnv();
  try {
    const payload = jwt.verify(refreshToken, envs.REFRESH_TOKEN_SECRET, {
      ignoreExpiration: true,
    }) as RefreshTokenPayload;
    // Delete refresh token
    const user = await UserModel.findByIdAndUpdate(
      payload.sub,
      { $pull: { tokens: { _id: payload.tokenId } } },
      { new: true },
    );
    console.log("user inside logout service : ", user);
  } catch (error) {
    console.log("error in logout service : ", error);
  }
}
