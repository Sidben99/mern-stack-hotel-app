import { Request, Response } from "express";
import { UpdateUserType } from "@lankaStay/shared/schemes/user/updateUserSchema";
import { successDataResponse } from "@/helpers/apiResponses";
import updateUserService from "@/services/user/updateUser.service";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema";
export default async function updateUserController(
  req: Request<any, any, UpdateUserType, any>,
  res: Response,
) {
  const { sub: id } = req.user;
  const user = await updateUserService(id, req.body);

  return successDataResponse<{ user: UserResponseType }>(
    res,
    200,
    "profile updated successfully",
    user,
  );
}
