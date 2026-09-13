import { Router } from "express";
import authenticateMiddleware from "@/middlewares/authenticate.middleware";
import { updateAccount } from "@lankaStay/shared/schemes/account/updateAccountSchema";
import validationMiddleware from "@/middlewares/validation.middleware";
import updateAccountController from "@/controllers/account/updateAccount.controller";
const accountRouter = Router();
/**
 * BODY:   { email: string, password: string }
 * SUCCESS:  200  { message, data: { accessToken, user } }  + httpOnly refreshToken cookie
 * ERRORS:  400  VALIDATION_ERROR  /  404  NOT_FOUND  /  400  INVALID_CREDENTIALS
 */
accountRouter.route("/profile").patch(
  authenticateMiddleware,
  validationMiddleware({
    body: updateAccount,
  }),
  updateAccountController,
);
export default accountRouter;
