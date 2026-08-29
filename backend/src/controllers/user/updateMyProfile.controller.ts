import { Request, Response } from "express";
import { UpdateMyProfileType } from "@lankaStay/shared/schemes/user/updateMyProfileSchema";
import { successDataResponse } from "@/helpers/apiResponses";
import updateMyProfileService from "@/services/user/updateMyProfile.service";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema";
export default async function updateMyProfileController(
  req: Request<any, any, UpdateMyProfileType, any>,
  res: Response,
) {
  const { sub: id } = req.user;
  const user = await updateMyProfileService(id, req.body);

  return successDataResponse<{ user: UserResponseType }>(
    res,
    200,
    "profile updated successfully",
    user,
  );
}
