import { UserModel } from "@/models/User.model";
import userResponseShapeFromDoc from "@/helpers/userResponseShapeFromDoc";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
export default async function getMeService(userId: string) {
  const user = await UserModel.findOne({ _id: userId });
  if (!user) throw new ApiError(404, "user not found", ERROR_CODES.NOT_FOUND);
  return { user: userResponseShapeFromDoc(user) };
}