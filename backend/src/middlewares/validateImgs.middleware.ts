import { Request, Response, NextFunction } from "express";
import ApiError from "@lankaStay/shared/utils/ApiError";
import { fileTypeFromFile } from "file-type";
import ACCEPTED_IMG_TYPE from "@lankaStay/shared/consts/acceptedImgType";
export async function validateImgsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new ApiError(400, "No files uploaded", "VALIDATION_ERROR");
  }
  const fileTypesPromises = req.files.map((file: Express.Multer.File) =>
    fileTypeFromFile(file.path),
  );
  const fileTypes = await Promise.all(fileTypesPromises);
  for (const fileType of fileTypes) {
    if (!fileType || !ACCEPTED_IMG_TYPE.includes(fileType.mime)) {
      throw new ApiError(400, "Invalid file type", "VALIDATION_ERROR");
    }
  }
  next();
}
