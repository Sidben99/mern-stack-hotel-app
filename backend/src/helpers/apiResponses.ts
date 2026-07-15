import { Response } from "express";
import ApiError from "@lankaStay/shared/utils/ApiError";
import type {
  ApiResponseMessage,
  ApiResponseData,
} from "@lankaStay/shared/utils/ApiResponse";

export function successMessageResponse(
  res: Response,
  status: number,
  message: string,
): Response<ApiResponseMessage> {
  return res.status(status).json({ message });
}

export function successDataResponse<T>(
  res: Response,
  status: number,
  message: string,
  data: T,
): Response<ApiResponseData<T>> {
  return res.status(status).json({ message, data });
}

export function errorResponse(res: Response, err: ApiError) {
  const { status, code, message, details } = err;
  if (!details) {
    return res.status(status).json({
      message,
      code,
    });
  }
  return res.status(status).json({
    message,
    code,
    details,
  });
}
