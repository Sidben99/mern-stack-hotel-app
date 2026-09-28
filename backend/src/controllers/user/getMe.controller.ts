import { Request, Response } from "express";
import { successDataResponse } from "@/helpers/apiResponses";
import getMeService from "@/services/user/getMe.service";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema";
export default async function getMeController(req: Request, res: Response) {
  const { sub: id } = req.user;
  const user = await getMeService(id);
  return successDataResponse<{ user: UserResponseType }>(
    res,
    200,
    "user fetched successfully",
    user,
  );
}