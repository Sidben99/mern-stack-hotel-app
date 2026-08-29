import { Router } from "express";
import authenticateMiddleware from "@/middlewares/authenticate.middleware";
import { updateMyProfile } from "@lankaStay/shared/schemes/user/updateMyProfileSchema";
import { ownerApplicationSchema } from "@lankaStay/shared/schemes/owner/onwerApplicationSchema";
import validationMiddleware from "@/middlewares/validation.middleware";
import updateMyProfileController from "@/controllers/user/updateMyProfile.controller";
import becomOwnerController from "@/controllers/user/becomeOwner.controller";
import autherizeMiddleware from "@/middlewares/autherize.middleware";
import { ROLES } from "@lankaStay/shared/consts/roles";
export const userRouter = Router();
/**
 * BODY:   { email: string, password: string }
 * SUCCESS:  200  { message, data: { accessToken, user } }  + httpOnly refreshToken cookie
 * ERRORS:  400  VALIDATION_ERROR  /  404  NOT_FOUND  /  400  INVALID_CREDENTIALS
 */
userRouter.route("/my-profile").patch(
  authenticateMiddleware,
  autherizeMiddleware([ROLES.OWNER, ROLES.USER]),
  validationMiddleware({
    body: updateMyProfile,
  }),
  updateMyProfileController,
);
userRouter.route("/become-owner").post(
  authenticateMiddleware,
  autherizeMiddleware([ROLES.USER]),
  validationMiddleware({
    body: ownerApplicationSchema,
  }),
  becomOwnerController,
);
