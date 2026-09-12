import { Request, Response, NextFunction } from "express";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import { APPLICATION_STATUS } from "@lankaStay/shared/consts/applicationStatus";
import { UserModel } from "@/models/User.model";

export async function ownerStatusMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { sub: id } = req.user;
  const user = await UserModel.findOne({ _id: id });
  if (!user) throw new ApiError(404, "user not found", ERROR_CODES.NOT_FOUND);
  if (user.ownerInfo?.applicationStatus === APPLICATION_STATUS.APPROVED) {
    throw new ApiError(
      400,
      "user is already an owner",
      ERROR_CODES.BAD_REQUEST,
    );
  }
  if (user.ownerInfo?.applicationStatus === APPLICATION_STATUS.PENDING) {
    throw new ApiError(
      400,
      "application is already pending",
      ERROR_CODES.BAD_REQUEST,
    );
  }
  res.locals.userDoc = user;
  next();
}
