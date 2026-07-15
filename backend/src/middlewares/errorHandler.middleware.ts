import { Request, Response } from "express";
import { errorResponse } from "../helpers/apiResponses";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
export default function (err, req: Request, res: Response, next) {
  console.log("error : ", err);
  if (err instanceof ApiError) {
    return errorResponse(res, err);
  }
  console.error("error inside error handler middleware : ", err);
  return errorResponse(
    res,
    new ApiError(
      500,
      "An unexpected error occurred on the server",
      ERROR_CODES.INTERNAL_SERVER_ERROR,
    ),
  );
}
