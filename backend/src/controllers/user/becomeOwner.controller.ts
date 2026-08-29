import { Request, Response } from "express";
import { OwnerApplicationType } from "@lankaStay/shared/schemes/owner/onwerApplicationSchema";
import { successDataResponse } from "@/helpers/apiResponses";
import becomeOwnerService from "@/services/user/becomeOwner.service";
import { UserResponseType } from "@lankaStay/shared/schemes/user/userResponseSchema";
import { APPLICATION_STATUS_TYPE } from "@lankaStay/shared/consts/applicationStatus";
export default async function becomOwnerController(
  req: Request<any, any, OwnerApplicationType, any>,
  res: Response,
) {
  const { sub: id } = req.user;
  const status = await becomeOwnerService(id, req.body);
  return successDataResponse<{ status: APPLICATION_STATUS_TYPE }>(
    res,
    200,
    "application submitted successfully",
    { status },
  );
}
