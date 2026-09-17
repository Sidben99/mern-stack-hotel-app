import { UserModel } from "@/models/User.model";
import userResponseShapeFromDoc from "@/helpers/userResponseShapeFromDoc";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import { APPLICATION_STATUS } from "@lankaStay/shared/consts/applicationStatus";
export default async function cancelOwnerApplicationService(userId: string) {
  const user = await UserModel.findOne({ _id: userId });
  if (!user) throw new ApiError(404, "user not found", ERROR_CODES.NOT_FOUND);
  const updatedUser = await UserModel.findOneAndUpdate(
    {
      _id: userId,
      "ownerInfo.applicationStatus": APPLICATION_STATUS.PENDING,
    },
    {
      $set: {
        "ownerInfo.applicationStatus": APPLICATION_STATUS.CANCELLED,
      },
    },
    { returnDocument: "after" },
  );

  if (!updatedUser) {
    throw new ApiError(
      400,
      "application can't be cancelled",
      ERROR_CODES.BAD_REQUEST,
    );
  }

  return { user: userResponseShapeFromDoc(updatedUser) };
}
