import { Request, Response, NextFunction } from "express";
import { errorResponse } from "@/helpers/apiResponses";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { MulterError } from "multer";
import { ERROR_CODES } from "@lankaStay/shared/consts/errorCodes";
import isBodyParserError from "@/helpers/isBodyParserError";
export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log("error : ", err);
  if (err instanceof ApiError) {
    return errorResponse(res, err);
  }
  if ("code" in err && err.code === 11000) {
    return errorResponse(
      res,
      new ApiError(
        409,
        "email already exists",
        ERROR_CODES.EMAIL_ALREADY_EXISTS,
      ),
    );
  }
  if (err instanceof MulterError) {
    return errorResponse(
      res,
      new ApiError(400, err.message, ERROR_CODES.FILE_UPLOAD_ERROR),
    );
  }
  const bodyParserError = isBodyParserError(err);
  if (bodyParserError) {
    return errorResponse(
      res,
      new ApiError(
        bodyParserError.status,
        err.message,
        ERROR_CODES.BODY_PARSER_ERROR,
      ),
    );
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
