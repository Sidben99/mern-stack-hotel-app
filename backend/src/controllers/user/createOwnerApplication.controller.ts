import { Request, Response } from "express";
import { OwnerApplicationType } from "@lankaStay/shared/schemes/user/ownerApplicationSchema";
import { successDataResponse } from "@/helpers/apiResponses";
import createOwnerApplicationService from "@/services/user/createOwnerApplication.service";
import { APPLICATION_STATUS_TYPE } from "@lankaStay/shared/consts/applicationStatus";
export default async function createOwnerApplicationController(
  req: Request<any, any, OwnerApplicationType, any>,
  res: Response,
) {
  const user = res.locals.userDoc!;
  const status = await createOwnerApplicationService(user, req.body);
  return successDataResponse<{ status: APPLICATION_STATUS_TYPE }>(
    res,
    200,
    "application submitted successfully",
    { status },
  );
}
