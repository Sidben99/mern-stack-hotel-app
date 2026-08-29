import { UserModel } from "@/models/User.model";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import { UpdateMyProfileType } from "@lankaStay/shared/schemes/user/updateMyProfileSchema";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema";
export default async function updateMyProfileService(
  userId: string,
  newUserData: UpdateMyProfileType,
) {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: newUserData,
    },
    { new: true },
  );
  // check if user exists
  if (!user) throw new ApiError(404, "user not found", ERROR_CODES.NOT_FOUND);
  // save user
  const userResponseDto: UserResponseType = {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    nationality: user.nationality,
  };
  return { user: userResponseDto };
}
