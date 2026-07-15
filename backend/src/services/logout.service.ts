import { UserModel } from "../models/User.model";
import { RefreshTokenPayload } from "../types/types";
import jwt from "jsonwebtoken";
export default async function logoutService(refreshToken: string) {
  const payload = jwt.decode(refreshToken) as RefreshTokenPayload;
  // Delete refresh token
  const user = await UserModel.findByIdAndUpdate(
    payload.sub,
    { $pull: { tokens: { _id: payload.tokenId } } },
    { new: true },
  );
  // console.log("user inside logout service : ", user);
}
