import { Request, Response } from "express";
import { successDataResponse } from "@/helpers/apiResponses";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema";
import cancelOwnerApplicationService from "@/services/user/cancelOwnerApplication.service";
export default async function cancelOwnerApplicationController(
  req: Request,
  res: Response,
) {
  const { sub } = req.user;
  const { user } = await cancelOwnerApplicationService(sub);
  return successDataResponse<{ user: UserResponseType }>(
    res,
    200,
    "application cancelled successfully",
    { user },
  );
}
