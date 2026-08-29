import { UserModel } from "@/models/User.model";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import { OwnerApplicationType } from "@lankaStay/shared/schemes/owner/onwerApplicationSchema";
import { APPLICATION_STATUS } from "@lankaStay/shared/consts/applicationStatus";
import { ADMIN_STATUS } from "@lankaStay/shared/consts/adminStatus";
export default async function becomeOwnerService(
  userId: string,
  ownerApplicationData: OwnerApplicationType,
) {
  const user = await UserModel.findOne({ _id: userId });
  // check if user exists
  if (!user) throw new ApiError(404, "user not found", ERROR_CODES.NOT_FOUND);
  if (user.ownerInfo?.applicationStatus === APPLICATION_STATUS.PENDING) {
    return user.ownerInfo.applicationStatus;
  }
  user.ownerInfo = {
    ...user.ownerInfo,
    ...ownerApplicationData,
    adminStatus: ADMIN_STATUS.PENDING,
    applicationStatus: APPLICATION_STATUS.PENDING,
  };
  await user.save();
  return APPLICATION_STATUS.PENDING;
}
