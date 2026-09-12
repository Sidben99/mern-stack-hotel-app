import fs from "fs";
import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
export function createCloudinaryUploadMiddleware(
  fieldName: string,
  single: boolean,
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const files = req.files as Express.Multer.File[];
    const fileUploadPromises = files.map((file: Express.Multer.File) =>
      (async function () {
        const results = await cloudinary.uploader.upload(file.path, {
          folder: "lankaStay/ownerCardIds",
        });
        await fs.promises.unlink(file.path);
        return results;
      })(),
    );
    const uploadedFiles = (await Promise.all(fileUploadPromises)).map(
      (fileResult) => ({
        img_url: fileResult.secure_url,
        img_id: fileResult.public_id,
      }),
    );

    if (single) {
      req.body[fieldName] = uploadedFiles[0];
    } else {
      req.body[fieldName] = uploadedFiles;
    }
    next();
  };
}
