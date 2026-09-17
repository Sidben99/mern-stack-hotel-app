import { UserModel } from "@/models/User.model";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import { UpdateUserType } from "@lankaStay/shared/schemes/user/updateUserSchema";
import userResponseShapeFromDoc from "@/helpers/userResponseShapeFromDoc";
export default async function updateUserService(
  userId: string,
  newUserData: UpdateUserType,
) {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: newUserData,
    },
    { returnDocument: "after" },
  );
  if (!user) throw new ApiError(404, "user not found", ERROR_CODES.NOT_FOUND);
  const userResponseDto = userResponseShapeFromDoc(user);
  return { user: userResponseDto };
}
