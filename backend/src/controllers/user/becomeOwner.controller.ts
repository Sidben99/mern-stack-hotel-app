import { Request, Response } from "express";
import { OwnerApplicationInfoType } from "@lankaStay/shared/schemes/owner/ownerApplicationInfoSchema";
import { successDataResponse } from "@/helpers/apiResponses";
import becomeOwnerService from "@/services/user/becomeOwner.service";
import { APPLICATION_STATUS_TYPE } from "@lankaStay/shared/consts/applicationStatus";
export default async function becomOwnerController(
  req: Request<any, any, OwnerApplicationInfoType, any>,
  res: Response,
) {
  const user = res.locals.userDoc!;
  const status = await becomeOwnerService(user, req.body);
  return successDataResponse<{ status: APPLICATION_STATUS_TYPE }>(
    res,
    200,
    "application submitted successfully",
    { status },
  );
}
