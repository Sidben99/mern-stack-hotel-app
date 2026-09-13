import { UserModel } from "@/models/User.model";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import { UpdateAccountType } from "@lankaStay/shared/schemes/account/updateAccountSchema";
import { AccountResponseType } from "@lankaStay/shared/schemes/account/accountResponseSchema";
export default async function updateAccountService(
  userId: string,
  newUserData: UpdateAccountType,
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
  const userResponseDto: AccountResponseType = {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    nationality: user.nationality,
    phoneNumber: user.phoneNumber,
  };
  return { user: userResponseDto };
}
