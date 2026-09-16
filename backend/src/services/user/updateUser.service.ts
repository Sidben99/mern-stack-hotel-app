import { UserModel } from "@/models/User.model";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import { UpdateUserType } from "@lankaStay/shared/schemes/user/updateUserSchema";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema";
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
  const userResponseDto: UserResponseType = {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    nationality: user.nationality,
    phoneNumber: user.phoneNumber,
    ownerInfo: user.ownerInfo
      ? {
          firstName: user.ownerInfo.firstName,
          lastName: user.ownerInfo.lastName,
          nationalNumber: user.ownerInfo.nationalNumber,
          dateOfBirth: user.ownerInfo.dateOfBirth,
          address: user.ownerInfo.address,
          cardImgInfo: { img_url: user.ownerInfo.cardImgInfo.img_url },
          applicationStatus: user.ownerInfo.applicationStatus,
          rejectionNote: user.ownerInfo.rejectionNote,
          adminReviewedAt: user.ownerInfo.adminReviewedAt,
          payoutsEnabled: user.ownerInfo.payoutsEnabled,
        }
      : undefined,
  };
  return { user: userResponseDto };
}
