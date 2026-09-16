import { Router } from "express";
import authenticateMiddleware from "@/middlewares/authenticate.middleware";
import { ownerApplicationFormSchema } from "@lankaStay/shared/schemes/user/ownerApplicationFormSchema";
import validationMiddleware from "@/middlewares/validation.middleware";
import becomOwnerController from "@/controllers/user/becomeOwner.controller";
import autherizeMiddleware from "@/middlewares/autherize.middleware";
import { ROLES } from "@lankaStay/shared/consts/roles";
import { createMulterUploadMiddleware } from "@/conf/multer.conf";
import { validateImgsMiddleware } from "@/middlewares/validateImgs.middleware";
import { createCloudinaryUploadMiddleware } from "@/middlewares/uploadToCloudinary.middleware";
import { ownerStatusMiddleware } from "@/middlewares/ownerStatus.middleware";
import { updateUserSchema } from "@lankaStay/shared/schemes/user/updateUserSchema";
import updateUserController from "@/controllers/user/updateUser.controller";
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

userRouter.route("/become-owner").post(
  authenticateMiddleware,
  autherizeMiddleware([ROLES.USER]),
  uploadMiddleware,
  validationMiddleware({
    body: ownerApplicationFormSchema.omit({ cardImg: true }),
  }),
  validateImgsMiddleware,
  ownerStatusMiddleware,
  uploadToCloudinaryMiddleware,
  becomOwnerController,
);

/**
 * BODY:   { username?, email?, phoneNumber?, nationality? }
 * SUCCESS:  200  { message, data: { user } }
 * ERRORS:  400  VALIDATION_ERROR  /  404  NOT_FOUND
 */
userRouter.route("/profile").patch(
  authenticateMiddleware,
  validationMiddleware({
    body: updateUserSchema,
  }),
  updateUserController,
);
export default userRouter;
