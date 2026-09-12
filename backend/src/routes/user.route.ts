import { Router } from "express";
import authenticateMiddleware from "@/middlewares/authenticate.middleware";
import { updateMyProfile } from "@lankaStay/shared/schemes/user/updateMyProfileSchema";
import { ownerApplicationSchema } from "@lankaStay/shared/schemes/owner/onwerApplicationSchema";
import validationMiddleware from "@/middlewares/validation.middleware";
import updateMyProfileController from "@/controllers/account/updateMyProfile.controller";
import becomOwnerController from "@/controllers/user/becomeOwner.controller";
import autherizeMiddleware from "@/middlewares/autherize.middleware";
import { ROLES } from "@lankaStay/shared/consts/roles";
import { createMulterUploadMiddleware } from "@/conf/multer.conf";
import { validateImgsMiddleware } from "@/middlewares/validateImgs.middleware";
import { createCloudinaryUploadMiddleware } from "@/middlewares/uploadToCloudinary.middleware";
import { ownerStatusMiddleware } from "@/middlewares/ownerStatus.middleware";
const userRouter = Router();
const uploadMiddleware = createMulterUploadMiddleware(
  "cardImg",
  5 * 1024 * 1024,
  1,
);
const uploadToCloudinaryMiddleware = createCloudinaryUploadMiddleware(
  "cardImgInfo",
  true,
);
/**
 * BODY:   { email: string, password: string }
 * SUCCESS:  200  { message, data: { accessToken, user } }  + httpOnly refreshToken cookie
 * ERRORS:  400  VALIDATION_ERROR  /  404  NOT_FOUND  /  400  INVALID_CREDENTIALS
 */
userRouter.route("/become-owner").post(
  authenticateMiddleware,
  autherizeMiddleware([ROLES.USER]),
  uploadMiddleware,
  validationMiddleware({
    body: ownerApplicationSchema.omit({ cardImg: true }),
  }),
  validateImgsMiddleware,
  ownerStatusMiddleware,
  uploadToCloudinaryMiddleware,
  becomOwnerController,
);
export default userRouter;
