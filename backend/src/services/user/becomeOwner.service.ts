import { UserDocType, UserModel } from "@/models/User.model";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import { OwnerApplicationInfoType } from "@lankaStay/shared/schemes/owner/ownerApplicationInfoSchema";
import { APPLICATION_STATUS } from "@lankaStay/shared/consts/applicationStatus";
import { ADMIN_STATUS } from "@lankaStay/shared/consts/adminStatus";
export default async function becomeOwnerService(
  user: UserDocType,
  ownerApplicationData: OwnerApplicationInfoType,
) {
  const updatedUser = await UserModel.findOneAndUpdate(
    {
      _id: user._id,
      "ownerInfo.applicationStatus": {
        $nin: [APPLICATION_STATUS.PENDING, APPLICATION_STATUS.APPROVED],
      },
    },
    {
      $set: {
        ownerInfo: {
          ...user.ownerInfo,
          ...ownerApplicationData,
          adminStatus: ADMIN_STATUS.PENDING,
          applicationStatus: APPLICATION_STATUS.PENDING,
        },
      },
    },
    { returnDocument: "after" },
  );

  if (!updatedUser) {
    throw new ApiError(
      400,
      "application is already in progress or approved",
      ERROR_CODES.BAD_REQUEST,
    );
  }

  return APPLICATION_STATUS.PENDING;
}
