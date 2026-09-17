import { UserDoc } from "@/models/User.model";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema";
export default function userResponseShapeFromDoc(
  user: UserDoc,
): UserResponseType {
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
  return userResponseDto;
}
