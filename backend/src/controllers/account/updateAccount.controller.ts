import { Request, Response } from "express";
import { UpdateAccountType } from "@lankaStay/shared/schemes/account/updateAccountSchema";
import { successDataResponse } from "@/helpers/apiResponses";
import updateAccountService from "@/services/account/updateAccount.service";
import { AccountResponseType } from "@lankaStay/shared/schemes/account/accountResponseSchema";
export default async function updateAccountController(
  req: Request<any, any, UpdateAccountType, any>,
  res: Response,
) {
  const { sub: id } = req.user;
  const user = await updateAccountService(id, req.body);

  return successDataResponse<{ user: AccountResponseType }>(
    res,
    200,
    "profile updated successfully",
    user,
  );
}
